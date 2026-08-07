import { BeaconWallet } from '@tezos-x/octez.js-dapp-wallet'
import { TezosToolkit } from '@tezos-x/octez.js'
import { RpcClient, RpcClientCache } from '@tezos-x/octez.js-rpc'
import {
  NetworkType,
  PermissionScope,
  BeaconEvent
} from '@tezos-x/octez.connect-sdk'

const rpc = new RpcClientCache(
  new RpcClient(process.env.NEXT_PUBLIC_RPC_ENDPOINT as string)
)
export const Tezos = new TezosToolkit(rpc)

// Use a global singleton to prevent multiple instances across HMR/StrictMode.
// The Beacon SDK explicitly warns (and can corrupt its own storage) when more
// than one DAppClient is constructed for the same origin, so we keep exactly
// one live instance on globalThis.
const g = globalThis as any

/**
 * Repair storage written by an older SDK build before the current SDK reads it.
 *
 * Older versions stored `beacon:last-selected-wallet` as a bare string (e.g.
 * "temple_chrome"); this version expects an object and crashes in
 * DAppClient.updateStorageWallet() with:
 *   TypeError: Cannot create property 'name' on string 'temple_chrome'
 * That write is not awaited inside the SDK, so it surfaces as an unhandled
 * rejection that our connect/init self-heal cannot catch — the value has to be
 * fixed before the SDK touches it. The key is cosmetic (wallet name/icon) and
 * defaults to `undefined`, so removing an incompatible value is safe; the SDK
 * repopulates it on the next successful connect.
 */
const sanitizeBeaconStorage = () => {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (!key || !key.toLowerCase().includes('beacon:')) continue
      if (!key.toLowerCase().includes('last-selected-wallet')) continue
      const raw = localStorage.getItem(key)
      if (raw === null) continue
      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        parsed = raw
      }
      if (typeof parsed !== 'object' || parsed === null) {
        localStorage.removeItem(key)
        console.warn(
          `[beacon] removed incompatible storage key ${key} (was ${typeof parsed})`
        )
      }
    }
  } catch (error) {
    console.warn('[beacon] storage sanitize failed', error)
  }
}

const buildBeaconWallet = (): BeaconWallet => {
  sanitizeBeaconStorage()
  const wallet = new BeaconWallet({
    name: 'Stake XTZ',
    appUrl: window.location.origin,
    network: { type: process.env.NEXT_PUBLIC_NETWORK as NetworkType },
    featuredWallets: ['kukai', 'trust', 'temple', 'umami']
  })
  // Keep a live subscription so the SDK reliably emits ACTIVE_ACCOUNT_SET.
  wallet.client.subscribeToEvent(BeaconEvent.ACTIVE_ACCOUNT_SET, () => {})
  return wallet
}

export const createBeaconWallet = (): BeaconWallet | undefined => {
  if (typeof window === 'undefined') return undefined
  if (!g.__BEACON_WALLET__) {
    g.__BEACON_WALLET__ = buildBeaconWallet()
  }
  return g.__BEACON_WALLET__ as BeaconWallet
}

// Names of every beacon-related IndexedDB database. `beacon` is the
// DAppClient's bug-report/metrics store; WALLET_CONNECT_V2_INDEXED_DB is the
// WalletConnect session store. Matched by substring so any variant is caught.
const BEACON_IDB_HINTS = ['beacon', 'wallet_connect']

const deleteIndexedDb = (name: string): Promise<void> =>
  new Promise(resolve => {
    try {
      const request = indexedDB.deleteDatabase(name)
      request.onsuccess = () => resolve()
      request.onerror = () => resolve()
      // A still-open connection defers the delete; don't block the reset on it.
      request.onblocked = () => resolve()
    } catch {
      resolve()
    }
  })

/**
 * Synchronously remove every `beacon:*` localStorage key.
 *
 * `client.destroy()` only clears the *main* client's unprefixed keys; the SDK
 * also keeps transport-scoped copies under `P2P-beacon:*` / `WALLET-beacon:*`.
 * These keys (active-account, peers, seed) are what gate connection state, so
 * clearing them synchronously is sufficient for a reloaded page to come up
 * disconnected. This is the part that must always run before a reload.
 */
export function purgeBeaconLocalStorage(): void {
  if (typeof window === 'undefined') return
  try {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.toLowerCase().includes('beacon:')) keys.push(key)
    }
    keys.forEach(key => localStorage.removeItem(key))
  } catch (error) {
    console.warn('[beacon] purge: localStorage clear failed', error)
  }
}

/**
 * Best-effort removal of the beacon IndexedDB databases (`beacon` metrics/
 * bug-report store and `WALLET_CONNECT_V2_INDEXED_DB` WC session).
 *
 * IMPORTANT: this may never resolve on Safari — deleteDatabase() blocks on an
 * open connection and Safari does not reliably fire onblocked/onsuccess. Callers
 * that need to reload afterwards MUST NOT await this (fire-and-forget); the page
 * reload closes the connections regardless.
 */
export async function purgeBeaconIndexedDb(): Promise<void> {
  if (typeof window === 'undefined' || !window.indexedDB) return
  try {
    const factory = indexedDB as IDBFactory & {
      databases?: () => Promise<{ name?: string }[]>
    }
    let names: string[] = []
    if (typeof factory.databases === 'function') {
      names = (await factory.databases()).map(d => d.name ?? '').filter(Boolean)
    }
    if (!names.length) names = ['beacon', 'WALLET_CONNECT_V2_INDEXED_DB']
    const targets = names.filter(name =>
      BEACON_IDB_HINTS.some(hint => name.toLowerCase().includes(hint))
    )
    await Promise.all(targets.map(deleteIndexedDb))
  } catch (error) {
    console.warn('[beacon] purge: indexedDB clear failed', error)
  }
}

/**
 * True when storage holds at least one paired peer (a `*peers*` record with a
 * non-empty array). Beacon records the connected wallet as a peer, so an active
 * account with NO peer means the transport session was evicted — a dead
 * connection we should treat as disconnected rather than trust.
 *
 * Fail-safe: if storage can't be read we return true so a valid session is
 * never dropped by mistake; we only report "no peer" after a clean scan.
 */
export function hasBeaconPeer(): boolean {
  if (typeof window === 'undefined') return false
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key || !key.toLowerCase().includes('beacon:')) continue
      if (!key.toLowerCase().includes('peers')) continue
      const raw = localStorage.getItem(key)
      if (!raw) continue
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) return true
      } catch {
        // A non-JSON peer value still implies a peer; stay safe and keep it.
        if (raw.trim().length > 2) return true
      }
    }
  } catch {
    return true
  }
  return false
}

export async function requestBeaconPermissions(wallet: BeaconWallet) {
  return await wallet.client.requestPermissions({
    scopes: [PermissionScope.OPERATION_REQUEST, PermissionScope.SIGN]
  })
}

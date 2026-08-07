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
 * Remove every persisted trace of Beacon.
 *
 * `client.destroy()` only clears the *main* client's unprefixed `beacon:*`
 * keys. The SDK also keeps transport-scoped copies under `P2P-beacon:*` /
 * `WALLET-beacon:*`, plus IndexedDB databases (`beacon` for metrics/bug-report
 * and `WALLET_CONNECT_V2_INDEXED_DB` for the WC session). Those survive
 * destroy() and are exactly the stale state that used to force a manual
 * "clear site data" on Safari, so wipe all of it here.
 */
export async function purgeBeaconStorage(): Promise<void> {
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
 * Fully tears down the current Beacon connection and rebuilds a fresh client.
 *
 * `BeaconWallet.disconnect()` (-> `client.destroy()`) gracefully disconnects
 * the transport, but only clears the main client's unprefixed keys — so we
 * follow it with a full purgeBeaconStorage() to remove the transport-scoped
 * namespaces and IndexedDB too. The singleton is dropped and a brand new
 * client built for the next connect.
 *
 * This is the programmatic equivalent of the "clear site data" step users
 * previously had to perform by hand on Safari.
 */
export async function resetBeaconWallet(): Promise<BeaconWallet | undefined> {
  if (typeof window === 'undefined') return undefined
  const existing = g.__BEACON_WALLET__ as BeaconWallet | undefined
  if (existing) {
    try {
      await existing.disconnect()
    } catch (error) {
      console.warn('[beacon] reset: destroy failed, purging anyway', error)
    }
  }
  // Drop the reference before purging so open IndexedDB connections can close.
  g.__BEACON_WALLET__ = undefined
  await purgeBeaconStorage()
  return createBeaconWallet()
}

export async function requestBeaconPermissions(wallet: BeaconWallet) {
  return await wallet.client.requestPermissions({
    scopes: [PermissionScope.OPERATION_REQUEST, PermissionScope.SIGN]
  })
}

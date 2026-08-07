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

/**
 * Fully tears down the current Beacon connection and rebuilds a fresh client.
 *
 * `BeaconWallet.disconnect()` calls `client.destroy()`, which disconnects the
 * transport, runs the WalletConnect IndexedDB cleanup and deletes *every*
 * `beacon:*` key from localStorage (secret seed, peers, matrix + walletconnect
 * session state, accounts). After destroy() the instance is documented as no
 * longer usable, so we drop the singleton and build a brand new one for the
 * next connect.
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
      console.warn('[beacon] reset: destroy failed, rebuilding anyway', error)
    }
  }
  g.__BEACON_WALLET__ = undefined
  return createBeaconWallet()
}

export async function requestBeaconPermissions(wallet: BeaconWallet) {
  return await wallet.client.requestPermissions({
    scopes: [PermissionScope.OPERATION_REQUEST, PermissionScope.SIGN]
  })
}

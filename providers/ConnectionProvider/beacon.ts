import { BeaconWallet } from '@tezos-x/octez.js-dapp-wallet'
import { TezosToolkit } from '@tezos-x/octez.js'
import { RpcClient, RpcClientCache } from '@tezos-x/octez.js-rpc'
import { NetworkType, PermissionScope, BeaconEvent } from '@tezos-x/octez.connect-sdk'

const rpc = new RpcClientCache(
  new RpcClient(process.env.NEXT_PUBLIC_RPC_ENDPOINT as string)
)
export const Tezos = new TezosToolkit(rpc)

// Use a global singleton to prevent multiple instances across HMR/StrictMode
const g = globalThis as any
if (typeof window !== 'undefined') {
  if (!g.__BEACON_WALLET__) {
    g.__BEACON_WALLET__ = new BeaconWallet({
      name: 'Stake XTZ',
      appUrl: window.location.origin,
      network: { type: process.env.NEXT_PUBLIC_NETWORK as NetworkType },
      featuredWallets: ['kukai', 'trust', 'temple', 'umami']
    })
  }
  if (!g.__BEACON_SUBSCRIBED__ && g.__BEACON_WALLET__) {
    g.__BEACON_WALLET__.client.subscribeToEvent(
      BeaconEvent.ACTIVE_ACCOUNT_SET,
      () => {}
    )
    g.__BEACON_SUBSCRIBED__ = true
  }
}

export const createBeaconWallet = () =>
  typeof window === 'undefined'
    ? undefined
    : (g.__BEACON_WALLET__ as BeaconWallet)

export async function requestBeaconPermissions(wallet: BeaconWallet) {
  return await wallet.client.requestPermissions({
    scopes: [PermissionScope.OPERATION_REQUEST, PermissionScope.SIGN]
  })
}

import { BeaconWallet } from '@taquito/beacon-wallet'
import { TezosToolkit } from '@taquito/taquito'
import { RpcClient, RpcClientCache } from '@taquito/rpc'
import {
  NetworkType,
  PermissionScope,
  BeaconEvent
} from '@airgap/beacon-sdk'

import Home from '@/pages'
import { AccountRedirectListener } from '@/components/WalletDisconnect'

const rpc = new RpcClientCache(
  new RpcClient(process.env.NEXT_PUBLIC_RPC_ENDPOINT as string)
)
export const Tezos = new TezosToolkit(rpc)
export async function requestBeaconPermissions(wallet: BeaconWallet) {
  return await wallet.client.requestPermissions({
    scopes: [PermissionScope.OPERATION_REQUEST, PermissionScope.SIGN]
  })
}
export const createBeaconWallet = () =>
  typeof window === 'undefined'
    ? undefined
    : new BeaconWallet({
        name: 'Stake XTZ',
        appUrl: '', // need to fill this
        network: { type: process.env.NEXT_PUBLIC_NETWORK as NetworkType },
        featuredWallets: ['kukai', 'trust', 'temple', 'umami']
      })

export const connectBeacon = async () => {
  const beaconWallet = createBeaconWallet()
  Tezos.setWalletProvider(beaconWallet)

  if (!beaconWallet) {
    throw new Error('Tried to connect on the server')
  } else {
    beaconWallet.client.subscribeToEvent(
      BeaconEvent.ACTIVE_ACCOUNT_SET,
      async account => {
        console.log(
          `${BeaconEvent.ACTIVE_ACCOUNT_SET} triggered: `,
          account?.address
        )
        if (!account) {
          // go to homepage
          AccountRedirectListener()
          return
        }
      }
    )
    const response = await requestBeaconPermissions(beaconWallet)
    return {
      address: response.address,
      Tezos: Tezos,
      beaconWallet: beaconWallet
    }
  }
}

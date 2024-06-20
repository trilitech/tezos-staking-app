import { BeaconWallet } from '@taquito/beacon-wallet'
import { TezosToolkit } from '@taquito/taquito'
import { RpcClient, RpcClientCache } from '@taquito/rpc'
import {
  NetworkType,
  DAppClientOptions,
  PermissionScope
} from '@airgap/beacon-sdk'

const rpc = new RpcClientCache(
  new RpcClient(process.env.NEXT_PUBLIC_RPC_ENDPOINT as string)
)
export const Tezos = new TezosToolkit(rpc)

export const createBeaconWallet = () =>
  typeof window === 'undefined'
    ? undefined
    : new BeaconWallet({
        name: 'Stake XTZ',
        appUrl: '', // need to fill this
        network: { type: process.env.NEXT_PUBLIC_NETWORK as NetworkType },
        featuredWallets: ['kukai', 'trust', 'temple', 'umami']
      } as DAppClientOptions)

export const connectBeacon = async () => {
  const beaconWallet = createBeaconWallet()
  Tezos.setWalletProvider(beaconWallet)

  if (!beaconWallet) {
    throw new Error('Tried to connect on the server')
  }

  const response = await beaconWallet.client.requestPermissions({
    network: {
      type: process.env.NEXT_PUBLIC_NETWORK as any
    },
    scopes: [PermissionScope.OPERATION_REQUEST, PermissionScope.SIGN]
  })

  return {
    address: response.address,
    Tezos: Tezos,
    beaconWallet: beaconWallet
  }
}

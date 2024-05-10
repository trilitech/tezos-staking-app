import { BeaconWallet } from '@taquito/beacon-wallet'
import { PermissionScope } from '@airgap/beacon-types'

import { TezosToolkit } from '@taquito/taquito'
import { ConnectFn } from './types'

const Tezos = new TezosToolkit(
  // NEED TO CONFIRM: what is the rpc url here? parisnet?
  'https://rpc.ghostnet.teztnets.xyz/'
)

const createBeaconWallet = () =>
  typeof window === 'undefined'
    ? undefined
    : new BeaconWallet({
        name: 'Stake XTZ',
        appUrl: '', // need to fill this
        preferredNetwork: 'mainnet', // change to Paris net later?
        featuredWallets: ['kukai', 'trust', 'temple', 'umami']
      } as any)

export const connectBeacon: ConnectFn<{}> = async isNew => {
  if (!isNew) {
    const existingWallet = createBeaconWallet()

    const acc = await existingWallet?.client.getActiveAccount()

    if (!existingWallet || !acc) {
      throw new Error()
    }

    return {
      address: acc.address,
      connection: {
        imageUrl: undefined,
        connectionType: 'beacon',
        name: undefined
      },
      disconnect: async () => {
        await existingWallet.client.disconnect()
      }
    }
  }
  const beaconWallet = createBeaconWallet()
  Tezos.setWalletProvider(beaconWallet)

  if (!beaconWallet) {
    throw new Error('Tried to connect on the server')
  }

  const response = await beaconWallet.client.requestPermissions({
    network: {
      type: process.env.NEXT_PUBLIC_NETWORK as any
    },
    scopes: [PermissionScope.OPERATION_REQUEST]
  })

  return {
    address: response.address,
    connection: {
      imageUrl: undefined
    },
    disconnect: async () => {
      await beaconWallet.client.disconnect()
    }
  }
}

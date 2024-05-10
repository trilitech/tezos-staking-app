import { BeaconWallet } from '@taquito/beacon-wallet'
import { TezosToolkit } from '@taquito/taquito'

const Tezos = new TezosToolkit(
  // NEED TO CONFIRM: what is the rpc url here? parisnet?
  'https://rpc.ghostnet.teztnets.xyz/'
)

export const createBeaconWallet = () =>
  typeof window === 'undefined'
    ? undefined
    : new BeaconWallet({
        name: 'Stake XTZ',
        appUrl: '', // need to fill this
        preferredNetwork: process.env.NEXT_PUBLIC_NETWORK, // change to Paris net later?
        featuredWallets: ['kukai', 'trust', 'temple', 'umami']
      } as any)

export const connectBeacon = async () => {
  const beaconWallet = createBeaconWallet()
  Tezos.setWalletProvider(beaconWallet)

  if (!beaconWallet) {
    throw new Error('Tried to connect on the server')
  }

  const response = await beaconWallet.client.requestPermissions({
    network: {
      type: process.env.NEXT_PUBLIC_NETWORK as any
    }
  })

  return {
    address: response.address
  }
}

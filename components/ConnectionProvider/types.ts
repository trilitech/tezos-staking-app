import { DAppClient } from '@airgap/beacon-dapp'
export interface WalletConnection {
  imageUrl?: string
  connectionType?: string
  address?: string
  name?: string
}
export interface WalletInfo {
  address: string
  connection: WalletConnection
}

export interface WalletApi {
  address: string
  client?: DAppClient
  connection: WalletConnection
  disconnect: () => Promise<void>
}

interface BeaconOptions {}

export type ConnectFn<TOpts extends BeaconOptions> = (
  isNewConnection: boolean,
  connectionOptions: TOpts
) => Promise<WalletApi>

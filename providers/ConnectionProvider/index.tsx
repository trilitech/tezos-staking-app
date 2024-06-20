import { Context, createContext, useContext, useState, useEffect } from 'react'
import { WalletApi } from './types'
import { TezosToolkit } from '@taquito/taquito'
import {
  createBeaconWallet,
  Tezos as TzosInstance,
  connectBeacon
} from './beacon'
import { BeaconWallet } from '@taquito/beacon-wallet'
interface ConnectionContextType extends Partial<WalletApi> {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  isConnected?: boolean
  Tezos?: TezosToolkit
  beaconWallet?: BeaconWallet
}

const ConnectionContext = createContext<ConnectionContextType | null>(null)

export const ConnectionProvider = ({ children }: { children: any }) => {
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [Tezos, setTezos] = useState<TezosToolkit | undefined>(undefined)
  const [isConnected, setIsConnected] = useState<boolean | undefined>(undefined)
  const [beaconWallet, setBeaconWallet] = useState<BeaconWallet | undefined>(
    undefined
  )
  const wallet = createBeaconWallet()

  // check if connected to a wallet when refresh
  useEffect(() => {
    const checkIsConnected = async () => {
      const activeAccount = await wallet?.client.getActiveAccount()
      return activeAccount
    }

    checkIsConnected()
      .then(activeAccount => {
        setIsConnected(activeAccount ? true : false)
        setAddress(activeAccount?.address)
        setBeaconWallet(wallet)
        if (isConnected) {
          TzosInstance.setWalletProvider(wallet)
          setTezos(TzosInstance)
        }
      })
      .catch(error => {
        console.error('Error:', error)
        reset()
      })
  }, [isConnected, address])

  const reset = () => {
    setIsConnected(undefined)
    setAddress(undefined)
    setBeaconWallet(undefined)
    setTezos(undefined)
  }

  return (
    <ConnectionContext.Provider
      value={{
        connect: async () => {
          return await connectBeacon()
            .then(({ address, Tezos, beaconWallet }) => {
              setAddress(address)
              setIsConnected(true)
              setTezos(Tezos)
              setBeaconWallet(beaconWallet)
              location.reload()
            })
            .catch(() => {
              reset()
              throw new Error(
                'Error connecting to wallet, please try again later'
              )
            })
        },
        disconnect: async () => {
          await wallet?.clearActiveAccount()
          setAddress(undefined)
          setIsConnected(false)
        },
        address,
        isConnected,
        Tezos,
        beaconWallet
      }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}

type NotNothing<T> = T extends null | undefined ? never : T

export const useConnection = (): ConnectionContextType => {
  if (!ConnectionContext) throw new Error('WalletContext not initialized')
  return useContext(
    ConnectionContext as NotNothing<Context<ConnectionContextType>>
  )
}

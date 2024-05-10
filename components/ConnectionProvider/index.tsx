import { Context, createContext, useContext, useState, useEffect } from 'react'
import { connectBeacon } from './beacon'
import { WalletApi } from './types'
import { createBeaconWallet } from './beacon'
interface ConnectionContextType extends Partial<WalletApi> {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  isConnected: boolean | undefined
}

const ConnectionContext = createContext<ConnectionContextType | null>(null)

export const ConnectionProvider = ({ children }: { children: any }) => {
  const [address, setAddress] = useState<string | undefined>()
  const [isConnected, setIsConnected] = useState<boolean | undefined>(undefined)
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
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }, [isConnected, address])

  const clearAddress = async function () {
    setAddress(undefined)
  }

  return (
    <ConnectionContext.Provider
      value={{
        connect: async () => {
          return await connectBeacon()
            .then(({ address }) => {
              setAddress(address)
              setIsConnected(true)
            })
            .catch(() => {
              void clearAddress()
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
        isConnected
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

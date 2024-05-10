'use client'
import { Context, createContext, useContext, useState } from 'react'
import { connectBeacon } from './beacon'
import { WalletApi, WalletConnection } from './types'

interface ConnectionContextType extends Partial<WalletApi> {
  connect: () => Promise<WalletConnection>
}

const ConnectionContext = createContext<ConnectionContextType | null>(null)

export const ConnectionProvider = ({ children }: { children: any }) => {
  const [wallet, setWallet] = useState<WalletApi | undefined>()

  const onInitialConnectionComplete = async (
    wallet: WalletApi
  ): Promise<WalletConnection> => {
    setWallet(wallet)
    const { connection, address } = wallet
    return { ...connection, address }
  }

  const disconnect = async function () {
    setWallet(undefined)
  }

  return (
    <ConnectionContext.Provider
      value={{
        connect: async () => {
          return await connectBeacon(true, {})
            .then(onInitialConnectionComplete)
            .catch(() => {
              void disconnect()
              throw new Error(
                'Error connecting to wallet, please try again later'
              )
            })
        },
        ...wallet,
        disconnect: async () => {
          await disconnect()
          await wallet?.disconnect()
        }
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

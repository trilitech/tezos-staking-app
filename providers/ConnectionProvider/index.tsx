import {
  Context,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef
} from 'react'
import { WalletApi } from './types'
import { TezosToolkit } from '@taquito/taquito'
import {
  createBeaconWallet,
  Tezos as TzosInstance,
  requestBeaconPermissions
} from './beacon'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'
import { BeaconEvent } from '@airgap/beacon-sdk'

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
  const walletRef = useRef<BeaconWallet | undefined>(undefined)
  const subscribedRef = useRef<boolean>(false)
  if (typeof window !== 'undefined' && !walletRef.current) {
    walletRef.current = createBeaconWallet()
  }

  // On mount, sync active account and set provider
  useEffect(() => {
    const init = async () => {
      try {
        const wallet = walletRef.current
        // Ensure subscription exists before any account changes
        if (wallet && !subscribedRef.current) {
          wallet.client.subscribeToEvent(
            BeaconEvent.ACTIVE_ACCOUNT_SET,
            account => {
              if (account && walletRef.current) {
                setIsConnected(true)
                setAddress(account.address)
                setBeaconWallet(walletRef.current)
                TzosInstance.setWalletProvider(walletRef.current)
                setTezos(TzosInstance)
              } else {
                reset()
              }
            }
          )
          subscribedRef.current = true
        }
        const activeAccount = await wallet?.client.getActiveAccount()
        if (activeAccount && wallet) {
          setIsConnected(true)
          setAddress(activeAccount.address)
          setBeaconWallet(wallet)
          TzosInstance.setWalletProvider(wallet)
          setTezos(TzosInstance)
        } else {
          reset()
        }
      } catch (error) {
        console.error('Error:', error)
        reset()
      }
    }
    init()
  }, [])

  const reset = () => {
    setIsConnected(false)
    setAddress(undefined)
    setBeaconWallet(undefined)
    setTezos(undefined)
  }

  return (
    <ConnectionContext.Provider
      value={{
        connect: async () => {
          const wallet = walletRef.current
          if (!wallet) {
            throw new Error('Wallet not initialized')
          }
          return await requestBeaconPermissions(wallet)
            .then(response => {
              setAddress(response.address)
              setIsConnected(true)
              setBeaconWallet(wallet)
              TzosInstance.setWalletProvider(wallet)
              setTezos(TzosInstance)
              trackGAEvent(GAAction.CONNECT_SUCCESS, GACategory.WALLET_SUCCESS)
            })
            .catch(() => {
              reset()
              trackGAEvent(GAAction.CONNECT_ERROR, GACategory.WALLET_ERROR)
              throw new Error(
                'Error connecting to wallet, please try again later'
              )
            })
        },
        disconnect: async () => {
          const wallet = walletRef.current
          await wallet?.client.removeAllAccounts()
          setAddress(undefined)
          setIsConnected(false)
          reset()
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

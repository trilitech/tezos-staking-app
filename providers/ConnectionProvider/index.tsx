import {
  Context,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef
} from 'react'
import { WalletApi } from './types'
import { TezosToolkit } from '@tezos-x/octez.js'
import {
  createBeaconWallet,
  resetBeaconWallet,
  Tezos as TzosInstance,
  requestBeaconPermissions
} from './beacon'
import { BeaconWallet } from '@tezos-x/octez.js-dapp-wallet'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'
import { BeaconEvent } from '@tezos-x/octez.connect-sdk'

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

  const reset = () => {
    setIsConnected(false)
    setAddress(undefined)
    setBeaconWallet(undefined)
    setTezos(undefined)
  }

  // Push a resolved active account into React state (or reset if there is none).
  const applyActiveAccount = (
    account: { address: string } | null | undefined
  ) => {
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

  // Subscribe the provider's handler to a wallet client exactly once per client.
  const subscribeWallet = (wallet: BeaconWallet | undefined) => {
    if (wallet && !subscribedRef.current) {
      wallet.client.subscribeToEvent(BeaconEvent.ACTIVE_ACCOUNT_SET, account =>
        applyActiveAccount(account)
      )
      subscribedRef.current = true
    }
  }

  // Fully destroy the current client (wiping all beacon:* storage + transport
  // state), rebuild a fresh one, re-subscribe and return to a disconnected UI.
  const hardReset = async () => {
    try {
      subscribedRef.current = false
      walletRef.current = await resetBeaconWallet()
      subscribeWallet(walletRef.current)
    } catch (error) {
      console.warn('[beacon] hard reset failed', error)
    }
    reset()
  }

  // On mount, sync active account and set provider
  useEffect(() => {
    const init = async () => {
      try {
        const wallet = walletRef.current
        subscribeWallet(wallet)
        const activeAccount = await wallet?.client.getActiveAccount()
        applyActiveAccount(activeAccount)
      } catch (error) {
        console.error('Error:', error)
        reset()
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          // `removeAllAccounts()` only cleared the account list and left the
          // secret seed, peers and transport/matrix/walletconnect state behind
          // in the browser. Fully destroy and rebuild so nothing stale is
          // cached — this is what stops Safari from needing a site-data clear.
          await hardReset()
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

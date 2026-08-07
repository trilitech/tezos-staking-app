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
  purgeBeaconStorage,
  hasBeaconPeer,
  Tezos as TzosInstance,
  requestBeaconPermissions
} from './beacon'
import { BeaconWallet } from '@tezos-x/octez.js-dapp-wallet'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'
import { BeaconEvent } from '@tezos-x/octez.connect-sdk'

interface ConnectionContextType extends Partial<WalletApi> {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  resetConnection: () => Promise<void>
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
  const initRanRef = useRef<boolean>(false)
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

  // "Fresh visit": the single way we ever drop to a disconnected state. Purge
  // every beacon store and reload — the reloaded page constructs exactly one
  // clean client. We deliberately do NOT call the SDK's destroy() here:
  //  - destroy-and-rebuild in place races with the client's async init (doubly
  //    so under StrictMode's double-invoked mount effect) and leaves the next
  //    connect with no answer from the wallet;
  //  - destroy() also stops the Matrix transport mid-sync, which rejects with a
  //    benign "Syncing stopped manually" error that surfaces in the dev overlay.
  // The page reload tears everything down cleanly instead.
  const freshVisit = async () => {
    await purgeBeaconStorage()
    if (typeof window !== 'undefined') window.location.href = '/'
  }

  // On mount, restore the active account (or reset)
  useEffect(() => {
    // Guard against StrictMode's double-invoked mount effect (dev).
    if (initRanRef.current) return
    initRanRef.current = true

    const init = async () => {
      const wallet = walletRef.current
      subscribeWallet(wallet)
      const activeAccount = await wallet?.client
        .getActiveAccount()
        .catch(() => undefined)

      if (!activeAccount || !wallet) {
        reset()
        return
      }

      // A restored account with no paired peer means the transport session was
      // evicted (classic Safari ITP): the account survives but the connection
      // is dead. Treat it as a fresh visit rather than trusting a dead account.
      if (!hasBeaconPeer()) {
        console.warn('[beacon] active account has no peer; resetting to connect')
        await freshVisit()
        return
      }

      // Account + peer present: trust it. If the transport turns out to be dead,
      // the first wallet operation detects it and drops to a fresh visit
      // (see components/Operations/operations.ts + resetConnection).
      applyActiveAccount(activeAccount)
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
              // Just reset UI state — do NOT tear down/rebuild the client, or
              // the next attempt connects against a broken instance.
              reset()
              trackGAEvent(GAAction.CONNECT_ERROR, GACategory.WALLET_ERROR)
              throw new Error(
                'Error connecting to wallet, please try again later'
              )
            })
        },
        disconnect: async () => {
          // Fresh visit: purge every beacon store (main + transport namespaces
          // + IndexedDB) and reload to the connect screen. This is what stops
          // Safari from ever needing a manual "clear site data".
          await freshVisit()
        },
        resetConnection: async () => {
          // A lost/dead connection is treated exactly like a disconnect: fresh
          // visit. You are either connected or you are not.
          await freshVisit()
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

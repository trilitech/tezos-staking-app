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

  // "Fresh visit": the single way we ever drop to a disconnected state. We do
  // NOT destroy-and-rebuild the client in place — that races with the client's
  // own async init (and doubly so under React StrictMode's double-invoked mount
  // effect) and leaves the transport wired to a dead instance, so the next
  // connect gets no answer from the wallet. Instead we purge every beacon store
  // and reload: the reloaded page constructs exactly one clean client.
  const freshVisit = async (notifyWallet = false) => {
    try {
      // Best-effort: let the wallet know we're disconnecting. Never rebuild.
      if (notifyWallet) await walletRef.current?.disconnect()
    } catch (error) {
      console.warn('[beacon] teardown during reset failed', error)
    }
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
          // Full teardown as a fresh visit: notify the wallet, purge every
          // beacon store (main + transport namespaces + IndexedDB), then reload
          // to the connect screen. This is what stops Safari from ever needing a
          // manual "clear site data".
          await freshVisit(true)
        },
        resetConnection: async () => {
          // A lost/dead connection is treated exactly like a disconnect: fresh
          // visit. You are either connected or you are not.
          await freshVisit(false)
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

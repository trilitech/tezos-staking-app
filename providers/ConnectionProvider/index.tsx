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

// A stale Beacon session (e.g. after Safari ITP evicts part of the store) makes
// the transport hang forever with no rejection. Time-box those calls so we can
// detect the hang and self-heal instead of leaving the user stuck.
//
// - INIT: getActiveAccount() is instant, but client.init() re-establishes the
//   transport for a restored session and is where a dead peer hangs. A healthy
//   session settles in well under a second, so a generous ceiling only ever
//   elapses in the genuinely-broken case.
// - CONNECT: requestPermissions() legitimately waits for the user to approve in
//   their wallet, so this is a long backstop against a never-settling promise,
//   not a UX deadline.
const INIT_TIMEOUT_MS = 12_000
const CONNECT_TIMEOUT_MS = 180_000

class TimeoutError extends Error {}

const withTimeout = <T,>(
  promise: Promise<T>,
  ms: number,
  label: string
): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new TimeoutError(`${label} timed out after ${ms}ms`)),
      ms
    )
    promise.then(
      value => {
        clearTimeout(timer)
        resolve(value)
      },
      error => {
        clearTimeout(timer)
        reject(error)
      }
    )
  })

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
      // is dead. Deterministically treat that as disconnected — a fresh visit —
      // instead of trusting the stale account.
      if (!hasBeaconPeer()) {
        console.warn('[beacon] active account has no peer, resetting to connect')
        await hardReset()
        return
      }

      // Peer present, so the session should be live. Verify the transport can
      // actually be re-established before trusting it; if init() hangs or
      // throws, self-heal by wiping the poisoned state rather than making the
      // user clear site data by hand.
      try {
        await withTimeout(wallet.client.init(), INIT_TIMEOUT_MS, 'client.init')
        applyActiveAccount(activeAccount)
      } catch (error) {
        console.error('[beacon] stale session detected on init, resetting', error)
        await hardReset()
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
          try {
            const response = await withTimeout(
              requestBeaconPermissions(wallet),
              CONNECT_TIMEOUT_MS,
              'requestPermissions'
            )
            setAddress(response.address)
            setIsConnected(true)
            setBeaconWallet(wallet)
            TzosInstance.setWalletProvider(wallet)
            setTezos(TzosInstance)
            trackGAEvent(GAAction.CONNECT_SUCCESS, GACategory.WALLET_SUCCESS)
          } catch (error) {
            // A failed or hung permission request usually means a poisoned
            // transport. Wipe it so the next attempt starts from a clean
            // client instead of retrying against the same broken state.
            trackGAEvent(GAAction.CONNECT_ERROR, GACategory.WALLET_ERROR)
            await hardReset()
            throw new Error(
              'Error connecting to wallet, please try again later'
            )
          }
        },
        disconnect: async () => {
          // `removeAllAccounts()` only cleared the account list and left the
          // secret seed, peers and transport/matrix/walletconnect state behind
          // in the browser. Fully destroy and rebuild so nothing stale is
          // cached — this is what stops Safari from needing a site-data clear.
          await hardReset()
        },
        resetConnection: async () => {
          // A lost/dead connection is treated like a fresh visit: purge every
          // beacon store and reload to the connect screen. You are either
          // connected or you are not — no stuck in-between state.
          await purgeBeaconStorage()
          if (typeof window !== 'undefined') window.location.href = '/'
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

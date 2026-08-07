import { TezosToolkit } from '@tezos-x/octez.js'
import { BeaconWallet } from '@tezos-x/octez.js-dapp-wallet'
import { BeaconError } from '@tezos-x/octez.connect-sdk'

export interface OperationResult {
  success: boolean
  opHash: string
  message: string
  // True when the failure means the wallet connection itself is gone, so the
  // app should drop back to a clean "connect" state (a fresh visit) rather than
  // show an operation error.
  connectionLost?: boolean
}

// A dead/evicted transport session makes the wallet call hang with no
// rejection. Time-box the request (not the on-chain confirmation) so we can
// recover instead of spinning forever. Generous, since a live request also
// waits for the user to approve in their wallet.
const OP_TIMEOUT_MS = 180_000

class ConnectionLostError extends Error {}
class OpTimeoutError extends Error {}

const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new OpTimeoutError()), ms)
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

// Distinguish "the connection is dead" from a normal operation failure (user
// rejection, insufficient funds, a chain error). Kept intentionally tight to
// Beacon transport semantics so a slow RPC / chain error is never mistaken for
// a lost connection.
const isConnectionError = (err: any): boolean => {
  if (err instanceof ConnectionLostError || err instanceof OpTimeoutError) {
    return true
  }
  const text = `${err?.name ?? ''} ${err?.message ?? ''}`.toLowerCase()
  return [
    'no active account',
    'not connected',
    'no active peer',
    'transport error',
    'messaging could not be started'
  ].some(hint => text.includes(hint))
}

const connectionLostResult = (): OperationResult => ({
  success: false,
  opHash: '',
  message: '',
  connectionLost: true
})

async function checkActiveAccount(wallet: BeaconWallet) {
  const activeAccount = await wallet.client.getActiveAccount()
  if (!activeAccount) {
    // No active account at operation time means we are not really connected.
    throw new ConnectionLostError('No active account')
  }
}

export const setDelegate = async (
  Tezos: TezosToolkit,
  delegate: string | undefined,
  wallet: BeaconWallet
): Promise<OperationResult> => {
  let opHash = ''
  try {
    await checkActiveAccount(wallet)
    const op = await withTimeout(
      Tezos.wallet.setDelegate({ delegate }).send(),
      OP_TIMEOUT_MS
    )
    const response = await op.confirmation()
    opHash = op.opHash
    const success = response?.completed ?? false
    return { success, opHash, message: '' }
  } catch (err: any) {
    if (isConnectionError(err)) return connectionLostResult()
    return {
      success: false,
      opHash: '',
      message: processOpErrors(err, 'delegate')
    }
  }
}

export const stake = async (
  Tezos: TezosToolkit,
  amount: number,
  wallet: BeaconWallet
): Promise<OperationResult> => {
  let opHash = ''
  try {
    await checkActiveAccount(wallet)

    const op = await withTimeout(
      Tezos.wallet.stake({ amount }).send(),
      OP_TIMEOUT_MS
    )
    const response = await op.confirmation()
    const success = response?.completed ?? false
    return { success, opHash, message: '' }
  } catch (err: any) {
    if (isConnectionError(err)) return connectionLostResult()
    return {
      success: false,
      opHash: '',
      message: processOpErrors(err, 'stake')
    }
  }
}

export const unstake = async (
  Tezos: TezosToolkit,
  amount: number,
  wallet: BeaconWallet
): Promise<OperationResult> => {
  let opHash = ''
  try {
    await checkActiveAccount(wallet)

    const op = await withTimeout(
      Tezos.wallet.unstake({ amount }).send(),
      OP_TIMEOUT_MS
    )
    const response = await op.confirmation()
    opHash = op.opHash
    const success = response?.completed ?? false
    return { success, opHash, message: '' }
  } catch (err: any) {
    if (isConnectionError(err)) return connectionLostResult()
    return {
      success: false,
      opHash: '',
      message: processOpErrors(err, 'unstake')
    }
  }
}

export const finalizeUnstake = async (
  Tezos: TezosToolkit,
  wallet: BeaconWallet
): Promise<OperationResult> => {
  let opHash = ''
  try {
    await checkActiveAccount(wallet)
    const op = await withTimeout(
      Tezos.wallet.finalizeUnstake({}).send(),
      OP_TIMEOUT_MS
    )
    const response = await op.confirmation()
    opHash = op.opHash
    const success = response?.completed ?? false
    return { success, opHash, message: '' }
  } catch (err: any) {
    if (isConnectionError(err)) return connectionLostResult()
    return {
      success: false,
      opHash: '',
      message: processOpErrors(err, 'finalize unstake')
    }
  }
}

function processOpErrors(err: any, op: string): string {
  let errMsg = ''
  if (!!err) {
    errMsg = `Error occured in ${op} operation, try again.`
    if (!!err.message) {
      errMsg = `${errMsg} ${err.message.replace(/ *\[[^)]*\] */g, '')}`
    } else if ('fullDescription' in err) {
      const desc = (err as BeaconError).fullDescription?.description
      if (desc) {
        errMsg = `${errMsg} ${desc}`
      }
    }
  }
  return errMsg
}

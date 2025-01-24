import { PermissionScope } from '@airgap/beacon-sdk'
import { TezosToolkit } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { requestBeaconPermissions } from '@/providers/ConnectionProvider/beacon'
export interface OperationResult {
  success: boolean
  opHash: string
  message: string
}
import { BeaconError } from '@airgap/beacon-sdk'

async function checkActiveAccount(wallet: BeaconWallet) {
  const activeAccount = await wallet.client.getActiveAccount()
  if (!activeAccount) {
    await requestBeaconPermissions(wallet)
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
    const op = await Tezos.wallet.setDelegate({ delegate }).send()
    const response = await op.confirmation()
    opHash = op.opHash
    let success = response?.completed ?? false
    return { success: success, opHash, message: '' }
  } catch (err: any) {
    return { success: false, opHash: '', message: processOpErrors(err, "delegate") }
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

    const op = await Tezos.wallet.stake({ amount }).send()
    const response = await op.confirmation()
    let success = response?.completed ?? false
    return { success: success, opHash, message: '' }
  } catch (err: any) {
    return { success: false, opHash: '', message: processOpErrors(err, "stake") }
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

    const op = await Tezos.wallet.unstake({ amount }).send()
    const response = await op.confirmation()
    opHash = op.opHash
    let success = response?.completed ?? false
    return { success: success, opHash, message: '' }
  } catch (err: any) {
    return { success: false, opHash: '', message: processOpErrors(err, "unstake") }
  }
}

export const finalizeUnstake = async (
  Tezos: TezosToolkit,
  wallet: BeaconWallet
): Promise<OperationResult> => {
  let opHash = ''
  try {
    await checkActiveAccount(wallet)
    const op = await Tezos.wallet.finalizeUnstake({}).send()
    const response = await op.confirmation()
    opHash = op.opHash
    let success = response?.completed ?? false
    return { success: success, opHash, message: '' }
  } catch (err: any) {
    return { success: false, opHash: '', message: processOpErrors(err, "finalize unstake") }
  }
}

function processOpErrors(err: any, op: string): string {
  let err_msg = ''
  if (!!err){
    err_msg = `Error occured in ${op} operation, try again.`
    if(!!err.message) {
    err_msg += err.message.replace(/ *\[[^)]*\] */g, '')
  }
  else if(!!err.errorType) {
    err_msg += BeaconError.getError(err.errorType, err.errorData).message
  }
  }
  return err_msg
}


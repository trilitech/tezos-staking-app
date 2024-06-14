import { Estimate, TezosToolkit } from '@taquito/taquito'
export interface OperationResult {
  success: boolean
  opHash: string
  message: string
}

export const setDelegate = async (
  Tezos: TezosToolkit,
  delegate: string | undefined
): Promise<OperationResult> => {
  let opHash = ''
  try {
    const op = await Tezos.wallet.setDelegate({ delegate }).send()
    const response = await op.confirmation()
    opHash = op.opHash
    let success = response?.completed ?? false
    return { success: success, opHash, message: '' }
  } catch (err: any) {
    console.error(err)
    return {
      success: false,
      opHash: '',
      message: `Error occured in delegate operation, try again. ${err && err.message.replace(/ *\[[^)]*\] */g, '')}`
    }
  }
}

export const stake = async (
  Tezos: TezosToolkit,
  amount: number
): Promise<OperationResult> => {
  let opHash = ''
  try {
    const op = await Tezos.wallet.stake({ amount }).send()
    const response = await op.confirmation()
    opHash = op.opHash
    let success = response?.completed ?? false
    return { success: success, opHash, message: '' }
  } catch (err: any) {
    console.error(err)
    return {
      success: false,
      opHash: '',
      message: `Error occured in stake operation, try again. ${err && err.message.replace(/ *\[[^)]*\] */g, '')}`
    }
  }
}

export const unstake = async (
  Tezos: TezosToolkit,
  amount: number
): Promise<OperationResult> => {
  let opHash = ''
  try {
    const op = await Tezos.wallet.unstake({ amount }).send()
    const response = await op.confirmation()
    opHash = op.opHash
    let success = response?.completed ?? false
    return { success: success, opHash, message: '' }
  } catch (err: any) {
    console.error(err)
    return {
      success: false,
      opHash: '',
      message: `Error occured in unstake operation, try again. ${err && err.message.replace(/ *\[[^)]*\] */g, '')}`
    }
  }
}

export const finalizeUnstake = async (
  Tezos: TezosToolkit
): Promise<OperationResult> => {
  let opHash = ''
  try {
    const op = await Tezos.wallet.finalizeUnstake({}).send()
    const response = await op.confirmation()
    opHash = op.opHash
    let success = response?.completed ?? false
    return { success: success, opHash, message: '' }
  } catch (err: any) {
    console.error(err)
    return {
      success: false,
      opHash: '',
      message: `Error occured in finalize unstake operation, try again. ${err && err.message.replace(/ *\[[^)]*\] */g, '')}`
    }
  }
}

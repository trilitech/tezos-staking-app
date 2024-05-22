import { TezosToolkit } from '@taquito/taquito'

export interface OperationResult {
  success: boolean
  opHash: string
  errorMessage?: string
}

export const setDelegate = async (
  Tezos: TezosToolkit,
  delegate: string | undefined
): Promise<OperationResult> => {
  let opHash = ''
  try {
    const op = await Tezos.wallet.setDelegate({ delegate }).send()
    await op.confirmation()
    opHash = op.opHash
    return { success: true, opHash }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      opHash: '',
      errorMessage: 'Errors occur in delegate/undelegate operation, try again.'
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
    await op.confirmation()
    opHash = op.opHash
    return { success: true, opHash }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      opHash: '',
      errorMessage: 'Errors occur in stake operation, try again.'
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
    await op.confirmation()
    opHash = op.opHash
    return { success: true, opHash }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      opHash: '',
      errorMessage: 'Errors occur in unstake operation, try again.'
    }
  }
}

export const finalizeUnstake = async (
  Tezos: TezosToolkit
): Promise<OperationResult> => {
  let opHash = ''
  try {
    const op = await Tezos.wallet.finalizeUnstake({}).send()
    await op.confirmation()
    opHash = op.opHash
    return { success: true, opHash }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      opHash: '',
      errorMessage: 'Errors occur in finalize unstake operation, try again.'
    }
  }
}

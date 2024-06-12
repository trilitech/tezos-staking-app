import { Estimate, TezosToolkit } from '@taquito/taquito'
export interface OperationResult {
  success: boolean
  opHash: string
  message: string
}

export enum OperationType {
  Delegate = 'delegate',
  Stake = 'stake',
  Unstake = 'unstake',
  FinalizeUnstake = 'finalizeUnstake'
}

export const getFee = async (
  operation: OperationType,
  Tezos: TezosToolkit | undefined,
  address: string | undefined,
  amount: number
): Promise<{ gasFee: number; message: string }> => {
  if (!Tezos || !address)
    return { gasFee: 0, message: 'Wallet Not initialized' }

  let response = new Estimate(0, 0, 0, 0, 0)

  try {
    switch (operation) {
      case 'delegate':
        response = await Tezos.estimate.setDelegate({
          source: address ?? '',
          fee: 0,
          gasLimit: 10000,
          storageLimit: 0
        })
        break
      case 'stake':
        response = await Tezos.estimate.stake({
          source: address ?? '',
          fee: 0,
          gasLimit: 10000,
          storageLimit: 0,
          amount
        })
        break
      case 'unstake':
        response = await Tezos.estimate.unstake({
          source: address ?? '',
          fee: 0,
          gasLimit: 10000,
          storageLimit: 0,
          amount
        })
        break
      case 'finalizeUnstake':
        response = await Tezos.estimate.finalizeUnstake({
          source: address ?? '',
          fee: 0,
          gasLimit: 10000,
          storageLimit: 0,
          amount: 0
        })
        break
      default:
        throw new Error('Operation type is not defined')
    }

    return {
      gasFee: Math.max(response.totalCost, response.suggestedFeeMutez),
      message: ''
    }
  } catch (error) {
    return {
      gasFee: 0,
      message: 'Fail to estimate fees ' + error
    }
  }
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

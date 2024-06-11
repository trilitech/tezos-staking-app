import { Estimate, TezosToolkit } from '@taquito/taquito'
import { mutezToTez } from '@/utils/mutezToTez'
import { useConnection } from '@/providers/ConnectionProvider'

export interface OperationResult {
  success: boolean
  opHash: string
  message: string
}

export type OperationType = 'delegate' | 'stake' | 'unstake' | 'finalizeUnstake'

export const setDelegate = async (
  Tezos: TezosToolkit,
  delegate: string | undefined
): Promise<OperationResult> => {
  let opHash = ''
  try {
    const op = await Tezos.wallet.setDelegate({ delegate }).send()
    await op.confirmation()
    opHash = op.opHash
    return { success: true, opHash, message: 'Set delegate successfully' }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      opHash: '',
      message: 'Errors occur in delegate/undelegate operation, try again.'
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
    return { success: true, opHash, message: 'Stake successfully' }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      opHash: '',
      message: 'Errors occur in stake operation, try again.'
    }
  }
}

export const GetFees = async (
  operation: OperationType,
  amount: number
): Promise<number> => {
  let fees = 0
  const { Tezos, address } = useConnection()
  if (!Tezos) return 0
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
          amount
        })
        break
      default:
        throw new Error('Operation type is not defined')
        break
    }
    return Math.max(response.totalCost, response.suggestedFeeMutez)
  } catch (error) {
    throw new Error('Fail to estimate fees ' + error)
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
    return { success: true, opHash, message: 'Unstake successfully' }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      opHash: '',
      message: 'Errors occur in unstake operation, try again.'
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
    return { success: true, opHash, message: 'Finalize unstake successfully' }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      opHash: '',
      message: 'Errors occur in finalize unstake operation, try again.'
    }
  }
}

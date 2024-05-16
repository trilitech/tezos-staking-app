import { TezosToolkit } from '@taquito/taquito'
import { OperationResult } from './types'

export const setDelegate = async (
  Tezos: TezosToolkit,
  delegate: string
): Promise<OperationResult> => {
  let opHash = ''
  try {
    const op = await Tezos.wallet.setDelegate({ delegate }).send()
    await op.confirmation()
    opHash = op.opHash
    return { success: true, opHash }
  } catch (error) {
    console.log(error)
    return { success: false, opHash: '' }
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
    console.log(error)
    return { success: false, opHash: '' }
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
    console.log(error)
    return { success: false, opHash: '' }
  }
}

export const finalizeUnstake = async (
  Tezos: TezosToolkit,
  noArgs: undefined
): Promise<OperationResult> => {
  let opHash = ''
  try {
    const op = await Tezos.wallet.finalizeUnstake({}).send()
    await op.confirmation()
    opHash = op.opHash
    return { success: true, opHash }
  } catch (error) {
    console.log(error)
    return { success: false, opHash: '' }
  }
}

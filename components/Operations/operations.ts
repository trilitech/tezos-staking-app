import { TezosToolkit } from '@taquito/taquito'
import { OperationResult } from './types'

export const setDelegate = async (
  delegate: string,
  Tezos: TezosToolkit
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
  amount: number,
  Tezos: TezosToolkit
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
  amount: number,
  Tezos: TezosToolkit
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
  Tezos: TezosToolkit
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

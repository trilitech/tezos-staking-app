import { PermissionScope } from '@airgap/beacon-sdk'
import { OpKind, TezosToolkit } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { requestBeaconPermissions } from '@/providers/ConnectionProvider/beacon'

export interface OperationResult {
  success: boolean
  opHash: string
  message: string
}

export const setDelegate = async (
  Tezos: TezosToolkit,
  delegate: string | undefined,
  wallet: BeaconWallet
): Promise<OperationResult> => {
  let opHash = ''
  try {
    if (!wallet.account) {
      await requestBeaconPermissions(wallet)
    }

    const batch = await Tezos.wallet
      .batch([
        {
          kind: OpKind.DELEGATION,
          delegate: `${delegate}`
        },
        {
          kind: OpKind.TRANSACTION,
          to: wallet.account?.address ?? '',
          amount: 100,
          parameter: {
            entrypoint: 'stake',
            value: {
              prim: 'Unit'
            }
          }
        }
      ])
      .send()
    const response = await batch.confirmation()
    opHash = batch.opHash
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
  amount: number,
  wallet: BeaconWallet
): Promise<OperationResult> => {
  let opHash = ''
  try {
    if (!wallet.account) {
      await requestBeaconPermissions(wallet)
    }

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
  amount: number,
  wallet: BeaconWallet
): Promise<OperationResult> => {
  let opHash = ''
  try {
    if (!wallet.account) {
      await requestBeaconPermissions(wallet)
    }

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
  Tezos: TezosToolkit,
  wallet: BeaconWallet
): Promise<OperationResult> => {
  let opHash = ''
  try {
    if (!wallet.account) {
      await requestBeaconPermissions(wallet)
    }

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

import {
  AccountInfo,
  BlockchainHead,
  StakingOpsStatus,
  UnstakedOperation
} from './tezInterfaces'

import {
  BLOCK_TIME_IN_SEC,
  NUM_OF_BLOCKS_TO_FINALIZE_AFTER_UNSTAKE
} from '@/app/tezConstants'

const tzktBaseUrl = process.env.NEXT_PUBLIC_TZKT_API_URL as String
const bakersListApiUrl = `${tzktBaseUrl}/v1/delegates?active=true`
const accountInfoApiUrl = `${tzktBaseUrl}/v1/accounts/`
const unstakedOpsApiUrl = `${tzktBaseUrl}/v1/staking/unstake_requests?staker=`
const blockchainHeadApiUrl = `${tzktBaseUrl}/v1/head`

// Fetch functions moved outside of the component
const fetchBlockchainHeadData = async () => {
  const response = await fetch(blockchainHeadApiUrl)
  return response.json()
}

const fetchAccountInfoData = async (address: string | undefined) => {
  const accountInfoApiAddress = `${accountInfoApiUrl}${address}`
  const response = await fetch(accountInfoApiAddress)
  return response.json()
}

const fetchUnstakedOpsData = async (address: string | undefined) => {
  const unstakedOpsApiAddress = `${unstakedOpsApiUrl}${address}`
  const response = await fetch(unstakedOpsApiAddress)
  return response.json()
}

const fetchBakerData = async () => {
  const response = await fetch(bakersListApiUrl)
  return response.json()
}

const fetchAccountData = async (address: string | undefined) => {
  try {
    const [blockchainHeadData, accountInfoData, unstakedOpsData] =
      await Promise.all([
        fetchBlockchainHeadData(),
        fetchAccountInfoData(address),
        fetchUnstakedOpsData(address)
      ])

    return { blockchainHeadData, accountInfoData, unstakedOpsData }
  } catch (error) {
    throw new Error(
      `Error fetching data from Tzkt API. Check api/address is correct. Error: ${error}`
    )
  }
}
export const fetchData = async (
  address: string | undefined,
  setAccountInfo: (arg0: any) => void,
  setUnstakedOps: (arg0: UnstakedOperation[]) => void,
  setBakersList: (arg0: any) => void,
  stakingOpsStatus: StakingOpsStatus,
  setStakingOpsStatus: (arg0: StakingOpsStatus) => void
) => {
  try {
    const { blockchainHeadData, accountInfoData, unstakedOpsData } =
      await fetchAccountData(address)
    const bakersListData = await fetchBakerData()
    setBakersList(bakersListData)

    if (accountInfoData !== null && blockchainHeadData !== null) {
      let { opStatus, unstakingOps, totalFinalizableAmount } =
        updateStakingOpsStatus(
          blockchainHeadData,
          accountInfoData,
          unstakedOpsData,
          stakingOpsStatus
        )
      accountInfoData.totalFinalizableAmount = totalFinalizableAmount
      setAccountInfo(accountInfoData)
      setStakingOpsStatus(opStatus)
      setUnstakedOps(unstakingOps)
    }
  } catch (error) {
    window.alert(
      `Error fetching data from Tzkt API. Check api/address is correct. Error: ${error}`
    )
  }
}
export function updateStakingOpsStatus(
  blockHead: BlockchainHead,
  accountInfo: AccountInfo,
  unstakingOps: UnstakedOperation[],
  opStatus: StakingOpsStatus
): {
  opStatus: StakingOpsStatus
  unstakingOps: UnstakedOperation[]
  totalFinalizableAmount: number
} {
  const { delegate, balance, stakedBalance } = accountInfo ?? {}
  opStatus.Delegated = Boolean(delegate)
  opStatus.CanStake = (balance ?? 0) > 0
  opStatus.CanUnstake = (stakedBalance ?? 0) > 0

  let totalFinalizableAmount = 0
  if (unstakingOps !== null && unstakingOps.length > 0) {
    unstakingOps = unstakingOps.map(operation => {
      let levelDiff = blockHead.level - operation.firstLevel
      let remainingFinalizableAmount =
        operation.requestedAmount -
        operation.finalizedAmount -
        operation.slashedAmount -
        operation.restakedAmount

      if (levelDiff > NUM_OF_BLOCKS_TO_FINALIZE_AFTER_UNSTAKE) {
        if (remainingFinalizableAmount > 0) {
          opStatus.CanFinalizeUnstake = true
          totalFinalizableAmount += remainingFinalizableAmount
        }
      } else {
        operation.timeToFinalizeInSec =
          (NUM_OF_BLOCKS_TO_FINALIZE_AFTER_UNSTAKE - levelDiff) *
          BLOCK_TIME_IN_SEC //This is minimum time to finalize. Each block can take more than 10 sec if a consensus is not reached.
      }
      return operation
    })
  }
  return { opStatus, unstakingOps, totalFinalizableAmount }
}

import { useQuery } from '@tanstack/react-query'

import {
  AccountInfo,
  BlockchainHead,
  StakingOpsStatus,
  UnstakedOperation
} from './tezInterfaces'
import { mutezToTez } from '@/utils/mutezToTez'

const consensusRightsDelay = Number(
  process.env.NEXT_PUBLIC_CONSENSUS_RIGHTS_DELAY
)
const maxSlashingPeriod = 2
const tzktBaseUrl = process.env.NEXT_PUBLIC_TZKT_API_URL
const accountInfoApiUrl = `${tzktBaseUrl}/v1/accounts/`
const unstakedOpsApiUrl = `${tzktBaseUrl}/v1/staking/unstake_requests?staker=`
const blockchainHeadApiUrl = `${tzktBaseUrl}/v1/head`

// Fetch functions moved outside of the component
const fetchBlockchainHeadData = async () => {
  const response = await fetch(blockchainHeadApiUrl)
  if (!response.ok) console.error('fetchBlockchainHeadData error')
  return response.json()
}

const fetchAccountInfoData = async (address: string | undefined) => {
  const accountInfoApiAddress = `${accountInfoApiUrl}${address}`
  const response = await fetch(accountInfoApiAddress)
  if (!response.ok) console.error('fetchAccountInfoData error')
  return response.json()
}

const fetchUnstakedOpsData = async (address: string | undefined) => {
  const unstakedOpsApiAddress = `${unstakedOpsApiUrl}${address}`
  const response = await fetch(unstakedOpsApiAddress)
  if (!response.ok) console.error('fetchUnstakedOpsData error')
  return response.json()
}

export const useFetchAccountData = (address: string | undefined) => {
  const blockchainHeadQuery = useQuery({
    queryKey: ['blockchainHeadData'],
    queryFn: fetchBlockchainHeadData,
    refetchInterval: 10000,
    refetchIntervalInBackground: true
  })

  const accountInfoQuery = useQuery({
    queryKey: ['accountInfoData'],
    queryFn: () => fetchAccountInfoData(address),
    refetchInterval: 10000,
    refetchIntervalInBackground: true
  })

  const unstakedOpsQuery = useQuery({
    queryKey: ['unstakedOpsData'],
    queryFn: () => fetchUnstakedOpsData(address),
    refetchInterval: 10000,
    refetchIntervalInBackground: true
  })

  return {
    blockchainHeadData: blockchainHeadQuery.data,
    accountInfoData: accountInfoQuery.data,
    unstakedOpsData: unstakedOpsQuery.data,
    isLoading:
      blockchainHeadQuery.isLoading ||
      accountInfoQuery.isLoading ||
      unstakedOpsQuery.isLoading,
    error:
      blockchainHeadQuery.error ||
      accountInfoQuery.error ||
      unstakedOpsQuery.error
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
  opStatus.CanStake = opStatus.Delegated && (balance ?? 0) > 0
  opStatus.CanUnstake = opStatus.Delegated && (stakedBalance ?? 0) > 0

  let totalFinalizableAmount = 0
  if (unstakingOps !== null && unstakingOps?.length > 0) {
    unstakingOps = unstakingOps.map(operation => {
      let cycleDiff = blockHead.cycle - operation.cycle
      operation.remainingFinalizableAmount =
        operation.requestedAmount -
        operation.finalizedAmount -
        operation.slashedAmount -
        operation.restakedAmount
      let cycleRemaining = consensusRightsDelay + maxSlashingPeriod - cycleDiff
      if (cycleRemaining <= 0) {
        if (operation.remainingFinalizableAmount > 0) {
          opStatus.CanFinalizeUnstake = true
          totalFinalizableAmount += operation.remainingFinalizableAmount
        }
      } else {
        operation.numCyclesToFinalize = cycleRemaining
      }
      return operation
    })
  }
  return { opStatus, unstakingOps, totalFinalizableAmount }
}

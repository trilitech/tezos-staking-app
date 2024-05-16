export interface StakingOpsStatus {
  Delegated: boolean
  CanStake: boolean
  CanUnstake: boolean
  CanFinalzeUnstake: boolean
}

export interface AccountInfo {
  address: string
  balance: number
  stakedBalance: number
  unstakedBalance: number
  frozenDeposit: number
  alias: string
  publicKey: string
  revealed: true
  unstakedBaker: {
    alias: string
    address: string
  }
  counter: number
  delegate: {
    alias: string
    address: string
    active: false
  }
  delegationLevel: number
  delegationTime: string
  numDelegations: number
  stakingOpsCount: number
  stakingUpdatesCount: number
  setDelegateParametersOpsCount: number
  firstActivity: number
  firstActivityTime: string
  lastActivity: number
  lastActivityTime: string
  lostBalance: number
}

export interface BakersList {
  type: string
  id: number
  address: string
  active: true
  alias: string
  publicKey: string
  revealed: true
  balance: number
  rollupBonds: number
  smartRollupBonds: number
  stakedBalance: number
  unstakedBalance: number
  unstakedBaker: {
    alias: string
    address: string
  }
  externalStakedBalance: number
  externalUnstakedBalance: number
  roundingError: number
  totalStakedBalance: number
  stakersCount: number
  frozenDepositLimit: number
  limitOfStakingOverBaking: number
  edgeOfBakingOverStaking: number
  counter: number
  activationLevel: number
  activationTime: string
  deactivationLevel: number
  deactivationTime: string
  stakingBalance: number
  delegatedBalance: number
  numContracts: number
  rollupsCount: number
  smartRollupsCount: number
  activeTokensCount: number
  tokenBalancesCount: number
  tokenTransfersCount: number
  activeTicketsCount: number
  ticketBalancesCount: number
  ticketTransfersCount: number
  numDelegators: number
  numBlocks: number
  numEndorsements: number
  numPreendorsements: number
  numBallots: number
  numProposals: number
  numActivations: number
  numDoubleBaking: number
  numDoubleEndorsing: number
  numDoublePreendorsing: number
  numNonceRevelations: number
  vdfRevelationsCount: number
  numRevelationPenalties: number
  numEndorsingRewards: number
  numDelegations: number
  numOriginations: number
  numTransactions: number
  numReveals: number
  numRegisterConstants: number
  numSetDepositsLimits: number
  numMigrations: number
  transferTicketCount: number
  increasePaidStorageCount: number
  updateConsensusKeyCount: number
  drainDelegateCount: number
  smartRollupAddMessagesCount: number
  stakingOpsCount: number
  autostakingOpsCount: number
  stakingUpdatesCount: number
  setDelegateParametersOpsCount: number
  dalPublishCommitmentOpsCount: number
  firstActivity: number
  firstActivityTime: string
  lastActivity: number
  lastActivityTime: string
  extras: null
  lostBalance: number
  frozenDeposit: number
  frozenDeposits: number
  frozenRewards: number
  frozenFees: number
  metadata: null
}

export interface unstakedOperations {
  id: number
  cycle: number
  baker: {
    alias: string
    address: string
  }
  staker: {
    alias: string
    address: string
  }
  requestedAmount: number
  restakedAmount: number
  finalizedAmount: number
  slashedAmount: number
  roundingError: number
  updatesCount: number
  firstLevel: number
  firstTime: string
  lastLevel: number
  lastTime: string
  timeToFinalizeInSec: number
}

export interface blockchainHead {
  chain: string
  chainId: string
  cycle: number
  level: number
  hash: string
  protocol: string
  nextProtocol: string
  timestamp: string
  votingEpoch: number
  votingPeriod: number
  knownLevel: number
  lastSync: string
  synced: true
}

export function updateStakingOpsStatus(
  blockHead: blockchainHead,
  accountInfo: AccountInfo,
  unstakingOps: unstakedOperations[],
  opStatus: StakingOpsStatus
): { opStatus: StakingOpsStatus; unstakingOps: unstakedOperations[] } {
  if (accountInfo?.delegate !== null) {
    opStatus.Delegated = true
  }
  if (accountInfo?.balance !== undefined && accountInfo?.balance > 0) {
    opStatus.CanStake = true
  }
  if (
    accountInfo?.stakedBalance !== undefined &&
    accountInfo.stakedBalance > 0
  ) {
    opStatus.CanUnstake = true
  }
  let totalFinalizableAmount = 0
  if (unstakingOps !== null && unstakingOps.length > 0) {
    for (let i = 0; i < unstakingOps.length; i++) {
      let levelDiff = blockHead.level - unstakingOps[i].firstLevel
      let remainingFinalizableAmount =
        unstakingOps[i].requestedAmount -
        unstakingOps[i].finalizedAmount -
        unstakingOps[i].slashedAmount -
        unstakingOps[i].restakedAmount

      if (levelDiff > 16384 * 2) {
        if (remainingFinalizableAmount > 0) {
          opStatus.CanFinalzeUnstake = true
          totalFinalizableAmount += remainingFinalizableAmount
        }
      } else {
        unstakingOps[i].timeToFinalizeInSec = (16384 * 2 - levelDiff) * 10 // assuming 10sec block time. This is minimum time to finalize. Each block can take more than 10 sec if a consensus is not reached.
      }
    }
  }
  return { opStatus, unstakingOps }
}

const BLOCK_TIME_IN_SEC = 10
const NUM_OF_BLOCKS_TO_FINALIZE_AFTER_UNSTAKE = 32768 // 2 cycles each cycle with 16384 blocks

export interface StakingOpsStatus {
  Delegated: boolean
  CanStake: boolean
  CanUnstake: boolean
  CanFinalizeUnstake: boolean
}

export interface AccountInfo {
  type: string
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
  totalFinalizableAmount: number
}

export interface BakerInfo {
  type: string
  id: number
  address: string
  alias: string
  active: boolean
  balance: number
}

export interface UnstakedOperation {
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
  remainingFinalizableAmount: number
  numCyclesToFinalize: number
}

export interface BlockchainHead {
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

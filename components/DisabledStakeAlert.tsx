import { Box, Flex, Text } from '@chakra-ui/react'
import {
  AccountInfo,
  StakingOpsStatus
} from '@/components/Operations/tezInterfaces'
import { WarningIcon } from '@/components/icons'

export function getDisabledStakeButtonReason(
  opStatus: StakingOpsStatus
): string {
  let reason = ''
  if (!opStatus.bakerAcceptsStaking)
    reason =
      'Your current baker does not accept staking. Please select a different baker to enable staking.'
  else if (opStatus.pendingUnstakeOpsWithAnotherBaker)
    reason =
      'You have unstake operations with another baker which are pending finalization. Wait for few cycles.'
  return reason
}

export const StakingAlertBox = ({
  reason,
  backgroundColor
}: {
  reason: string
  backgroundColor: string
}) => {
  return (
    <Box
      w='100%'
      bg={backgroundColor} // Adjust the color to match the PrimaryButton disabled background
      borderLeft='4px solid gray'
      p={4}
    >
      <Flex alignItems='center' gap='12px'>
        <WarningIcon color={backgroundColor} />
        <Text fontSize='16px' lineHeight='22px' color='#2D3748'>
          {reason}
        </Text>
      </Flex>
    </Box>
  )
}

export const DisabledStakeAlert = ({
  opStatus,
  acctInfo
}: {
  opStatus: StakingOpsStatus
  acctInfo: AccountInfo | null
}) => {
  let backgroundColor = 'gray.200'
  if (opStatus.Delegated && !opStatus.CanStake) {
    if (!opStatus.bakerAcceptsStaking && (acctInfo?.stakedBalance ?? 0) > 0) {
      backgroundColor = 'red.200'
    }
    return (
      <StakingAlertBox
        backgroundColor={backgroundColor}
        reason={getDisabledStakeButtonReason(opStatus)}
      />
    )
  }
}

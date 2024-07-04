import { Box, Flex, Image } from '@chakra-ui/react'
import { StakingOpsStatus } from '@/components/Operations/tezInterfaces'
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

export const StakingAlertBox = ({ reason }: { reason: string }) => {
  return (
    <Box
      w='100%'
      bg='gray.200' // Adjust the color to match the PrimaryButton disabled background
      borderLeft='4px solid gray'
      p={4}
    >
      <Flex alignItems='center' gap='12px'>
        <WarningIcon />
        {reason}
      </Flex>
    </Box>
  )
}

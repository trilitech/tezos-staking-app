import { Box, BoxProps, Flex, Text } from '@chakra-ui/react'
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

export const DisabledStakeAlert = ({
  opStatus,
  acctInfo,
  ...styles
}: {
  opStatus: StakingOpsStatus
  acctInfo: AccountInfo | null
} & BoxProps) => {
  let iconFillColor = '#718096'
  let backgroudColor = '#EDF2F7'

  if (opStatus.Delegated && !opStatus.CanStake) {
    if (!opStatus.bakerAcceptsStaking && (acctInfo?.stakedBalance ?? 0) > 0) {
      iconFillColor = '#E53E3E'
      backgroudColor = '#FED7D7'
    }
    return (
      <Box
        w='100%'
        borderLeft='4px solid gray'
        p={4}
        {...styles}
        backgroundColor={backgroudColor}
      >
        <Flex alignItems='center' gap='12px'>
          <WarningIcon fill={iconFillColor} />
          <Text fontSize='16px' lineHeight='22px' color='#2D3748'>
            {getDisabledStakeButtonReason(opStatus)}
          </Text>
        </Flex>
      </Box>
    )
  }
}

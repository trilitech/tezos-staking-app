import React from 'react'
import { Box, Text, Flex, Image, useDisclosure } from '@chakra-ui/react'
import { UnstakedOperation } from '@/components/Operations/tezInterfaces'
import { mutezToTez } from '@/utils/mutezToTez'
import { secondsToHours, parseISO, format } from 'date-fns'
import { TertiaryButton } from '@/components/buttons/TertiaryButton'
import { FinalizeUnstakeModal } from '.'

export const UnstakeOperationBox = ({
  unstakeOp,
  totalFinalizableAmount
}: {
  unstakeOp?: UnstakedOperation
  totalFinalizableAmount?: number
}) => {
  const finalizeUnstakeModal = useDisclosure()

  let amount = 0
  let requestedTime = ''
  let timeRemainingInHour = 0
  let canFinalize = false

  if (!!totalFinalizableAmount) {
    amount = mutezToTez(totalFinalizableAmount)
    canFinalize = true
  }

  if (!!unstakeOp) {
    amount = mutezToTez(unstakeOp.remainingFinalizableAmount)
    requestedTime = format(parseISO(unstakeOp.firstTime), 'dd MMMM yyyy')
    timeRemainingInHour = secondsToHours(unstakeOp.timeToFinalizeInSec)
  }

  return (
    <Flex
      flexDir={['column', 'row']}
      alignItems='center'
      justify='space-between'
      pt='10px'
      borderTop='1px solid #EDF2F7'
      gap='10px'
    >
      <Box w='100%'>
        <Text fontSize='18px' color='#4A5568' mb='10px'>
          <Text as='span' fontWeight={600}>
            {amount}
          </Text>{' '}
          ꜩ
        </Text>
        {!!requestedTime && (
          <Flex
            flexDir={['column', 'row']}
            alignItems={['start', 'center']}
            justify='space-between'
          >
            <Text fontSize='14px' color='#4A5568'>
              Requested on{' '}
              <Text as='span' fontWeight={600}>
                {requestedTime}
              </Text>
            </Text>
            <Flex alignItems='center'>
              <Text fontSize='14px' color='#4A5568' fontStyle='italic'>
                Awaiting next cycle in{' '}
                {timeRemainingInHour > 24
                  ? `${Math.round(timeRemainingInHour / 24)} days`
                  : `${timeRemainingInHour} hours`}{' '}
                days
              </Text>
              <Image
                src='/images/MdOutlineHourglassTop.svg'
                alt='hour glass icon'
              />
            </Flex>
          </Flex>
        )}
      </Box>
      {canFinalize && (
        <TertiaryButton onClick={() => finalizeUnstakeModal.onOpen()}>
          Finalize
        </TertiaryButton>
      )}

      {!!totalFinalizableAmount && (
        <FinalizeUnstakeModal
          withdrawAmount={mutezToTez(totalFinalizableAmount)}
          isOpen={finalizeUnstakeModal.isOpen}
          onClose={finalizeUnstakeModal.onClose}
        />
      )}
    </Flex>
  )
}

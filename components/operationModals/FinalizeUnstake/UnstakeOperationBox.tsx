import React from 'react'
import { Box, Text, Flex, Image, useDisclosure } from '@chakra-ui/react'
import { UnstakedOperation } from '@/components/Operations/tezInterfaces'
import { mutezToTez } from '@/utils/mutezToTez'
import { TertiaryButton } from '@/components/buttons/TertiaryButton'
import { FinalizeUnstakeModal } from '.'

export const UnstakeOperationBox = ({
  unstakeOp,
  totalFinalizableAmount,
  spendableBalance
}: {
  unstakeOp?: UnstakedOperation
  totalFinalizableAmount?: number
  spendableBalance: number
}) => {
  const finalizeUnstakeModal = useDisclosure()

  let amount = 0
  let requestedCycle = 0
  let cyclesRemaining = 0
  let canFinalize = false

  if (!!totalFinalizableAmount) {
    amount = mutezToTez(totalFinalizableAmount)
    canFinalize = true
  }

  if (!!unstakeOp) {
    amount = mutezToTez(unstakeOp.remainingFinalizableAmount)
    requestedCycle = unstakeOp.cycle
    cyclesRemaining = unstakeOp.numCyclesToFinalize
  }

  return (
    <Flex
      flexDir={['column', 'row']}
      alignItems='center'
      justify='space-between'
      pt='24px'
      borderTop='1px solid #EDF2F7'
      gap='10px'
    >
      <Box w='100%'>
        <Flex flexDir='column'>
          <Text fontSize='18px' color='#4A5568' mb='10px'>
            <Text as='span' fontWeight={600}>
              {amount}
            </Text>{' '}
            ꜩ
          </Text>
          {!!totalFinalizableAmount && (
            <Text
              color='#4A5568'
              fontWeight={400}
              fontSize='14px'
              lineHeight='18px'
            >
              Ready to be finalized
            </Text>
          )}
        </Flex>
        {!!requestedCycle && (
          <Flex
            flexDir={['column', 'row']}
            alignItems={['start', 'center']}
            justify='space-between'
          >
            <Text fontSize='14px' color='#4A5568'>
              Requested in{' '}
              <Text as='span' fontWeight={600}>
                cycle {requestedCycle}
              </Text>
            </Text>
            <Flex alignItems='center' gap='6px'>
              <Text fontSize='14px' color='#4A5568' fontStyle='italic'>
                Ready to be finalized in cycle {requestedCycle + 5}
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
          spendableBalance={spendableBalance}
          withdrawAmount={mutezToTez(totalFinalizableAmount)}
          isOpen={finalizeUnstakeModal.isOpen}
          onClose={finalizeUnstakeModal.onClose}
        />
      )}
    </Flex>
  )
}

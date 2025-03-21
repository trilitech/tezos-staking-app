import React from 'react'
import { Box, Text, Flex, Image, useDisclosure } from '@chakra-ui/react'
import { UnstakedOperation } from '@/components/Operations/tezInterfaces'
import { mutezToTez } from '@/utils/mutezToTez'
import { TertiaryButton } from '@/components/buttons/TertiaryButton'
import { FinalizeUnstakeModal } from '.'
import Link from 'next/link'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

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
  const consensusRightDelay = Number(
    process.env.NEXT_PUBLIC_CONSENSUS_RIGHTS_DELAY
  )
  const maxSlashingPeriod = 2

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
      gap='20px'
    >
      <Box w='100%'>
        <Flex flexDir='column'>
          <Text display='inline-flex' gap={1} alignItems='center' pb='4px' fontSize='18px' color='gray.900'>
            <Text as='span' fontWeight={600}>
              {amount}
            </Text>{' '}
            <Image mt='4px' h='18px' src='/images/T3.svg' alt='Tezos Logo' />
          </Text>
          {!!totalFinalizableAmount && (
            <Text
              color='gray.600'
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
            gap='15px'
          >
            <Text fontSize='14px' color='gray.600'>
              Requested in{' '}
              <Text as='span' fontWeight={600}>
                cycle {requestedCycle}
              </Text>
            </Text>
            <Flex alignItems='center' gap='6px'>
              <Text fontSize='14px' color='gray.600' fontStyle='italic'>
                Finalizable in{' '}
                <Link
                  href={
                    (process.env.NEXT_PUBLIC_TZKT_UI_URL ?? 'tzkt.io') +
                    '/cycles'
                  }
                  target='_blank'
                >
                  <Text
                    textDecor='underline'
                    as='span'
                    _hover={{ cursor: 'pointer' }}
                  >
                    cycle{' '}
                    {requestedCycle + (consensusRightDelay + maxSlashingPeriod)}
                  </Text>
                </Link>
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
        <TertiaryButton
          w={['100%', null, 'auto']}
          onClick={() => {
            trackGAEvent(GAAction.BUTTON_CLICK, GACategory.FINALIZE_BEGIN)
            finalizeUnstakeModal.onOpen()
          }}
        >
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

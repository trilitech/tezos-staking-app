import React from 'react'
import { Box, Text, Flex, Image } from '@chakra-ui/react'
import { UnstakedOperation } from '@/components/Operations/tezInterfaces'
import { mutezToTez } from '@/utils/mutezToTez'
import Link from 'next/link'

export const UnstakeOperationBox = ({
  unstakeOp,
  totalFinalizableAmount
}: {
  unstakeOp?: UnstakedOperation
  totalFinalizableAmount?: number
}) => {
  const consensusRightDelay = Number(
    process.env.NEXT_PUBLIC_CONSENSUS_RIGHTS_DELAY
  )
  const maxSlashingPeriod = 2

  let amount = 0
  let requestedCycle = 0
  let cyclesRemaining = 0

  if (!!totalFinalizableAmount) {
    amount = mutezToTez(totalFinalizableAmount)
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
          <Text
            display='inline-flex'
            gap={1}
            alignItems='center'
            pb='4px'
            fontSize='18px'
            color='gray.900'
          >
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
                Finalized in{' '}
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
    </Flex>
  )
}

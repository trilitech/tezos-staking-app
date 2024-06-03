import React from 'react'
import { Box, Text, Flex } from '@chakra-ui/react'
import { UnstakedOperation } from '@/components/Operations/tezInterfaces'
import { UnstakeOperationBox } from './UnstakeOperationBox'

export const PendingUnstakeSection = ({
  unstOps,
  totalFinalizableAmount,
  numOfPendingUnstake
}: {
  unstOps: UnstakedOperation[]
  totalFinalizableAmount?: number
  numOfPendingUnstake: number
}) => {
  return (
    <Box w='100%'>
      <Flex
        fontSize='14px'
        color='#4A5568'
        fontWeight={600}
        justify='space-between'
        alignItems='center'
        mb='24px'
      >
        <Text>PENDING UNSTAKE</Text>
        <Text>({numOfPendingUnstake})</Text>
      </Flex>
      <Flex flexDir='column' gap='20px'>
        {/* Can finalize amount */}
        {!!totalFinalizableAmount && (
          <UnstakeOperationBox
            totalFinalizableAmount={totalFinalizableAmount}
          />
        )}

        {/* Remaining finalizable amount */}
        {unstOps
          .filter(op => op.numCyclesToFinalize > 0)
          .map((op, index) => (
            <UnstakeOperationBox key={index} unstakeOp={op} />
          ))}
      </Flex>
    </Box>
  )
}

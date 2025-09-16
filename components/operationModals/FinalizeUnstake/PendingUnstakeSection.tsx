import React from 'react'
import { Box, Text, Flex } from '@chakra-ui/react'
import { UnstakedOperation } from '@/components/Operations/tezInterfaces'
import { UnstakeOperationBox } from './UnstakeOperationBox'

export const PendingUnstakeSection = ({
  unstOps,
  totalFinalizableAmount,
  numOfPendingUnstake,
  spendableBalance
}: {
  unstOps: UnstakedOperation[]
  totalFinalizableAmount?: number
  numOfPendingUnstake: number
  spendableBalance: number
}) => {
  return (
    <Box w='100%'>
      <Flex
        fontSize='14px'
        color='gray.600'
        fontWeight={600}
        justify='space-between'
        alignItems='center'
        mb='24px'
      >
        <Text>
          {!!totalFinalizableAmount
            ? 'FINALIZABLE UNSTAKED'
            : 'PENDING UNSTAKE'}
        </Text>
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

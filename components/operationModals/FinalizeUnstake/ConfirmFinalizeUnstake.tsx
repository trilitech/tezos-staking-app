import React from 'react'
import { Flex } from '@chakra-ui/react'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { finalizeUnstake } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { TezosToolkit } from '@taquito/taquito'
import { Header, BalanceBox, ColumnHeader } from '@/components/modalBody'
import { useOperationResponse } from '@/providers/OperationResponseProvider'

interface ConfirmFinalizeUnstake {
  withdrawAmount: number
  handleOneStepForward: () => void
}

export const ConfirmFinalizeUnstake = ({
  withdrawAmount,
  handleOneStepForward
}: ConfirmFinalizeUnstake) => {
  const { Tezos } = useConnection()
  const { setMessage, setSuccess, setOpHash, setError } = useOperationResponse()

  return (
    <Flex flexDir='column' justify='center'>
      <Header mb='24px'>Finalize</Header>
      <ColumnHeader mb='12px'>AVAILABLE</ColumnHeader>
      <BalanceBox balance={withdrawAmount} />
      <ColumnHeader mb='12px'>Finalizable Balance</ColumnHeader>
      <BalanceBox balance={withdrawAmount} />
      <PrimaryButton
        onClick={async () => {
          const response = await finalizeUnstake(Tezos as TezosToolkit)

          if (response.success) {
            setOpHash(response.opHash)
            setMessage(
              'You have successfully finalized XTZ. These funds are now part of your available balance.'
            )
            setSuccess(true)
            handleOneStepForward()
          } else {
            setMessage(response.message)
            setError(true)
          }
        }}
      >
        Finalize
      </PrimaryButton>
    </Flex>
  )
}

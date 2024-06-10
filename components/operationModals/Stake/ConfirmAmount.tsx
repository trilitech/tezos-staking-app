import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { stake } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { TezosToolkit } from '@taquito/taquito'
import { useOperationResponse } from '@/providers/OperationResponseProvider'

interface ConfirmAmountProps {
  spendableBalance: number
  stakedAmount: number
  stakeFees: number
  setStakedAmount: (arg: number) => void
  handleOneStepForward: () => void
}

export const ConfirmAmount = ({
  spendableBalance,
  stakedAmount,
  stakeFees,
  setStakedAmount,
  handleOneStepForward
}: ConfirmAmountProps) => {
  const { Tezos } = useConnection()
  const { setMessage, setSuccess, setOpHash, setError } = useOperationResponse()

  return (
    <Flex flexDir='column'>
      <Header my='24px'>Confirm</Header>
      <ColumnHeader mb='12px'>AVAILABLE</ColumnHeader>
      <BalanceBox balance={spendableBalance - stakedAmount} />
      <ColumnHeader mb='12px'>STAKE AMOUNT</ColumnHeader>
      <BalanceBox balance={stakedAmount} />
      <PrimaryButton
        onClick={async () => {
          const response = await stake(Tezos as TezosToolkit, stakedAmount)

          if (response.success) {
            setOpHash(response.opHash)
            setMessage(
              'You have successfully staked your balance to the baker.'
            )
            setSuccess(true)
            setStakedAmount(0)
            handleOneStepForward()
          } else {
            setMessage(response.message)
            setError(true)
          }
        }}
      >
        Confirm
      </PrimaryButton>
    </Flex>
  )
}

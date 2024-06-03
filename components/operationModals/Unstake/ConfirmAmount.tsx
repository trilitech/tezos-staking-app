import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { unstake } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { TezosToolkit } from '@taquito/taquito'
import { useOperationResponse } from '@/providers/OperationResponseProvider'

interface ConfirmAmountProps {
  stakedAmount: number
  unstakeAmount: number
  setUnstakeAmount: (arg: number) => void
  handleOneStepForward: () => void
}

export const ConfirmAmount = ({
  stakedAmount,
  unstakeAmount,
  setUnstakeAmount,
  handleOneStepForward
}: ConfirmAmountProps) => {
  const { Tezos } = useConnection()
  const { setMessage, setSuccess, setOpHash, setError } = useOperationResponse()

  return (
    <Flex flexDir='column'>
      <Header my='24px'>Confirm</Header>
      <ColumnHeader mb='12px'>AVAILABLE</ColumnHeader>
      <BalanceBox balance={stakedAmount - unstakeAmount} />
      <ColumnHeader mb='12px'>UNSTAKE AMOUNT</ColumnHeader>
      <BalanceBox balance={unstakeAmount} />
      <PrimaryButton
        onClick={async () => {
          const response = await unstake(Tezos as TezosToolkit, unstakeAmount)

          if (response.success) {
            setOpHash(response.opHash)
            setMessage(
              'You have requested to unfreeze your staked balance. You need to wait for the next cycle to finalize and withdraw your frozen tez.'
            )
            setSuccess(true)
            setUnstakeAmount(0)
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

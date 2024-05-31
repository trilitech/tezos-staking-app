import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { unstake } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { TezosToolkit } from '@taquito/taquito'
import { useOperationError } from '@/providers/OperationErrorProvider'

interface ConfirmAmountProps {
  stakedAmount: number
  unstakeAmount: number
  setUnstakeAmount: (arg: number) => void
  setDisableOnClick: (arg: boolean) => void
  handleOneStepForward: () => void
  setTzktLink: (arg: string) => void
}

export const ConfirmAmount = ({
  stakedAmount,
  unstakeAmount,
  setUnstakeAmount,
  setDisableOnClick,
  handleOneStepForward,
  setTzktLink
}: ConfirmAmountProps) => {
  const { Tezos } = useConnection()
  const { setoOerationErrorMessage } = useOperationError()

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
            setTzktLink(
              `$(process.env.NEXT_PUBLIC_TZKT_UI_URL)/${response.opHash}`
            )
            setUnstakeAmount(0)
            handleOneStepForward()
          } else {
            setoOerationErrorMessage(response.errorMessage)
          }
        }}
      >
        Confirm
      </PrimaryButton>
    </Flex>
  )
}

import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { stake } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { TezosToolkit } from '@taquito/taquito'
import { useOperationError } from '@/providers/OperationErrorProvider'

interface ConfirmAmountProps {
  spendableBalance: number
  stakedAmount: number
  setStakedAmount: (arg: number) => void
  setDisableOnClick: (arg: boolean) => void
  handleOneStepForward: () => void
  setTzktLink: (arg: string) => void
}

export const ConfirmAmount = ({
  spendableBalance,
  stakedAmount,
  setStakedAmount,
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
      <BalanceBox balance={spendableBalance - stakedAmount} />
      <ColumnHeader mb='12px'>STAKE AMOUNT</ColumnHeader>
      <BalanceBox balance={stakedAmount} />
      <PrimaryButton
        onClick={async () => {
          setDisableOnClick(true)
          const response = await stake(Tezos as TezosToolkit, stakedAmount)
          setDisableOnClick(false)

          if (response.success) {
            setTzktLink(`https://parisnet.tzkt.io/${response.opHash}`)
            setStakedAmount(0)
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

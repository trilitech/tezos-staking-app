import React from 'react'
import { Flex } from '@chakra-ui/react'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { finalizeUnstake } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { TezosToolkit } from '@taquito/taquito'
import { Header, BalanceBox, ColumnHeader } from '@/components/modalBody'
import { useOperationError } from '@/providers/OperationErrorProvider'

interface ConfirmFinalizeUnstake {
  withdrawAmount: number
  setDisableOnClick: (arg: boolean) => void
  handleOneStepForward: () => void
  setTzktLink: (arg: string) => void
}

export const ConfirmFinalizeUnstake = ({
  withdrawAmount,
  setDisableOnClick,
  handleOneStepForward,
  setTzktLink
}: ConfirmFinalizeUnstake) => {
  const { Tezos } = useConnection()
  const { setoOerationErrorMessage } = useOperationError()

  return (
    <Flex flexDir='column' justify='center'>
      <Header mb='24px'>Finalize</Header>
      <ColumnHeader mb='12px'>AVAILABLE</ColumnHeader>
      <BalanceBox balance={withdrawAmount} />
      <ColumnHeader mb='12px'>WITHDRAW</ColumnHeader>
      <BalanceBox balance={withdrawAmount} />
      <PrimaryButton
        onClick={async () => {
          setDisableOnClick(true)
          const response = await finalizeUnstake(Tezos as TezosToolkit)
          setDisableOnClick(false)

          if (response.success) {
            setTzktLink(`https://parisnet.tzkt.io/${response.opHash}`)
            handleOneStepForward()
          } else {
            setoOerationErrorMessage(response.errorMessage)
          }
        }}
      >
        Finalize
      </PrimaryButton>
    </Flex>
  )
}

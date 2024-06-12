import React, { useState } from 'react'
import { Flex } from '@chakra-ui/react'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { unstake } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { TezosToolkit } from '@taquito/taquito'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'
interface ConfirmAmountProps {
  spendableBalance: number
  stakedAmount: number
  unstakeAmount: number
  setUnstakeAmount: (arg: number) => void
  handleOneStepForward: () => void
}

export const ConfirmAmount = ({
  spendableBalance,
  stakedAmount,
  unstakeAmount,
  setUnstakeAmount,
  handleOneStepForward
}: ConfirmAmountProps) => {
  const { Tezos } = useConnection()
  const { setMessage, setSuccess, setOpHash, setTitle } = useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')

  return (
    <Flex flexDir='column'>
      <Header mb='24px'>Confirm</Header>
      <ColumnHeader mb='12px'>SPENDABLE BALANCE</ColumnHeader>
      <BalanceBox mb='30px' fee={0.000585} balance={spendableBalance} />
      <ColumnHeader mb='12px'>STAKED</ColumnHeader>
      <BalanceBox mb='30px' balance={stakedAmount} />
      <ColumnHeader mb='12px'>AMOUNT TO UNSTAKE</ColumnHeader>
      <BalanceBox mb='30px' balance={unstakeAmount} />
      <PrimaryButton
        onClick={async () => {
          const response = await unstake(Tezos as TezosToolkit, unstakeAmount)

          if (response.success) {
            setOpHash(response.opHash)
            setTitle('Unstake Requested')
            setMessage(
              `You have unstaked ${unstakeAmount} tez. Wait for 4 cycles and then finalize your balance.`
            )
            setSuccess(true)
            setUnstakeAmount(0)
            handleOneStepForward()
          } else {
            setErrorMessage(response.message)
          }
        }}
      >
        Confirm
      </PrimaryButton>
      {!!errorMessage && <ErrorBlock errorMessage={errorMessage} />}
    </Flex>
  )
}

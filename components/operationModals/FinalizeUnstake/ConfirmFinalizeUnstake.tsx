import React, { useState } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { finalizeUnstake } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { TezosToolkit } from '@taquito/taquito'
import { Header, BalanceBox, ColumnHeader } from '@/components/modalBody'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'

interface ConfirmFinalizeUnstake {
  withdrawAmount: number
  handleOneStepForward: () => void
  spendableBalance: number
}

export const ConfirmFinalizeUnstake = ({
  withdrawAmount,
  handleOneStepForward,
  spendableBalance
}: ConfirmFinalizeUnstake) => {
  const { Tezos, address } = useConnection()
  const { setMessage, setSuccess, setOpHash } = useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)

  return (
    <Flex flexDir='column' justify='center'>
      <Header mb='24px'>Finalize</Header>
      <ColumnHeader mb='12px'>SPENDABLE BALANCE</ColumnHeader>
      <BalanceBox balance={spendableBalance} />
      <ColumnHeader mb='12px'>Finalizable Balance</ColumnHeader>
      <BalanceBox mb='30px' balance={withdrawAmount} />
      <PrimaryButton
        onClick={async () => {
          setWaitingOperation(true)
          const response = await finalizeUnstake(Tezos as TezosToolkit)
          setWaitingOperation(false)

          if (response.success) {
            setOpHash(response.opHash)
            setMessage(
              `You have successfully finalized ${withdrawAmount} ꜩ. These funds are now part of your spendable balance.`
            )
            setSuccess(true)
            handleOneStepForward()
          } else {
            setErrorMessage(response.message)
          }
        }}
      >
        {waitingOperation ? <Spinner /> : 'Finalize'}
      </PrimaryButton>
      {!!errorMessage && <ErrorBlock errorMessage={errorMessage} />}
    </Flex>
  )
}

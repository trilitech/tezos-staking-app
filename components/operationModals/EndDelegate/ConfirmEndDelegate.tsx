import React, { useState } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { setDelegate } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { TezosToolkit } from '@taquito/taquito'
import {
  AddressBox,
  Header,
  BalanceBox,
  ColumnHeader
} from '@/components/modalBody'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'

interface ConfirmEndDelegate {
  spendableBalance: number
  handleOneStepForward: () => void
  bakerName: string
}

export const ConfirmEndDelegate = ({
  spendableBalance,
  handleOneStepForward,
  bakerName
}: ConfirmEndDelegate) => {
  const { Tezos, address } = useConnection()
  const { setMessage, setSuccess, setOpHash, setTitle } = useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)

  return (
    <Flex flexDir='column' justify='center'>
      <Header my='24px'>Confirm</Header>
      <ColumnHeader mb='12px'>SPENDABLE BALANCE</ColumnHeader>
      <BalanceBox balance={spendableBalance} />
      <ColumnHeader mb='12px'>BAKER</ColumnHeader>
      <AddressBox address={bakerName} />
      <PrimaryButton
        onClick={async () => {
          setWaitingOperation(true)
          const response = await setDelegate(Tezos as TezosToolkit, undefined)
          setWaitingOperation(false)
          if (response.success) {
            setOpHash(response.opHash)
            setTitle('Delegation Ended!')
            setMessage(
              'You have successfully ended the delegation. You can now choose a new baker to delegate to.'
            )
            setSuccess(true)
            handleOneStepForward()
          } else {
            setErrorMessage(response.message)
          }
        }}
      >
        {waitingOperation ? <Spinner /> : 'Confirm'}
      </PrimaryButton>
      {!!errorMessage && <ErrorBlock errorMessage={errorMessage} />}
    </Flex>
  )
}

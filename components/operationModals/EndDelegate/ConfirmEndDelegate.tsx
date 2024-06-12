import React, { useState } from 'react'
import { Flex } from '@chakra-ui/react'
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
  bakerAddress: string
}

export const ConfirmEndDelegate = ({
  spendableBalance,
  handleOneStepForward,
  bakerAddress
}: ConfirmEndDelegate) => {
  const { Tezos } = useConnection()
  const { setMessage, setSuccess, setOpHash, setTitle } = useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')

  return (
    <Flex flexDir='column' justify='center'>
      <Header my='24px'>Confirm</Header>
      <ColumnHeader mb='12px'>SPENDABLE BALANCE</ColumnHeader>
      <BalanceBox fee={0.000585} balance={spendableBalance} />
      <ColumnHeader mb='12px'>BAKER</ColumnHeader>
      <AddressBox address={bakerAddress} />
      <PrimaryButton
        onClick={async () => {
          const response = await setDelegate(Tezos as TezosToolkit, undefined)

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
        Confirm
      </PrimaryButton>
      {!!errorMessage && <ErrorBlock errorMessage={errorMessage} />}
    </Flex>
  )
}

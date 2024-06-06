import React, { useState } from 'react'
import { Flex } from '@chakra-ui/react'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { setDelegate } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { TezosToolkit } from '@taquito/taquito'
import {
  Header,
  ColumnHeader,
  AddressBox,
  BalanceBox
} from '@/components/modalBody'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'

interface ConfirmDelegateProps {
  spendableBalance: number
  handleOneStepForward: () => void
  selectedBaker: BakerInfo
}

export const ConfirmDelegate = ({
  spendableBalance,
  handleOneStepForward,
  selectedBaker
}: ConfirmDelegateProps) => {
  const { Tezos } = useConnection()
  const { setMessage, setSuccess, setOpHash } = useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')

  return (
    <Flex flexDir='column' justify='center'>
      <Header pb='24px'>Confirm</Header>
      <ColumnHeader pb='12px'>SPENDABLE BALANCE</ColumnHeader>
      <BalanceBox fee={0.000585} balance={spendableBalance} />
      <ColumnHeader>Baker</ColumnHeader>
      <AddressBox address={selectedBaker.alias} />
      <PrimaryButton
        onClick={async () => {
          const response = await setDelegate(
            Tezos as TezosToolkit,
            selectedBaker.address
          )

          if (response.success) {
            setOpHash(response.opHash)
            setMessage(
              'You have successfully delegated your balance to the baker. You can now (optionally) stake funds with the baker, and potentially earn higher rewards.'
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

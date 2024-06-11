import React from 'react'
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
  const { setMessage, setSuccess, setError, setOpHash } = useOperationResponse()

  return (
    <Flex flexDir='column' justify='center'>
      <Header py='24px'>Confirm</Header>
      <ColumnHeader pb='12px'>AVAILABLE</ColumnHeader>
      <BalanceBox balance={spendableBalance} />
      <ColumnHeader>Baker</ColumnHeader>
      <AddressBox address={selectedBaker.address} />
      <PrimaryButton
        onClick={async () => {
          const response = await setDelegate(
            Tezos as TezosToolkit,
            selectedBaker.address
          )

          if (response.success) {
            setOpHash(response.opHash)
            setMessage(
              'You have successfully delegated your balance to the baker. You can now stake your balance.'
            )
            setSuccess(true)
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

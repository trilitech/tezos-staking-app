import React from 'react'
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
  const { setMessage, setSuccess, setOpHash, setError } = useOperationResponse()

  return (
    <Flex flexDir='column' justify='center'>
      <Header my='24px'>Confirm</Header>
      <ColumnHeader mb='12px'>AVAILABLE</ColumnHeader>
      <BalanceBox balance={spendableBalance} />
      <ColumnHeader mb='12px'>BAKER</ColumnHeader>
      <AddressBox address={bakerAddress} />
      <PrimaryButton
        onClick={async () => {
          const response = await setDelegate(Tezos as TezosToolkit, undefined)

          if (response.success) {
            setOpHash(response.opHash)
            setMessage(
              'You have successfully ended the delegation. You can start a new delegation now.'
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

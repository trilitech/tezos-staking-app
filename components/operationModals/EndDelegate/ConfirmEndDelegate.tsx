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
import { useOperationError } from '@/providers/OperationErrorProvider'

interface ConfirmEndDelegate {
  spendableBalance: number
  handleOneStepForward: () => void
  bakerAddress: string
  setDisableOnClick: (arg: boolean) => void
  setTzktLink: (arg: string) => void
}

export const ConfirmEndDelegate = ({
  spendableBalance,
  handleOneStepForward,
  bakerAddress,
  setDisableOnClick,
  setTzktLink
}: ConfirmEndDelegate) => {
  const { Tezos } = useConnection()
  const { setoOerationErrorMessage } = useOperationError()

  return (
    <Flex flexDir='column' justify='center'>
      <Header my='24px'>Confirm</Header>
      <ColumnHeader mb='12px'>AVAILABLE</ColumnHeader>
      <BalanceBox balance={spendableBalance} />
      <ColumnHeader mb='12px'>BAKER</ColumnHeader>
      <AddressBox address={bakerAddress} />
      <PrimaryButton
        onClick={async () => {
          setDisableOnClick(true)
          const response = await setDelegate(Tezos as TezosToolkit, undefined)
          setDisableOnClick(false)

          if (response.success) {
            setTzktLink(`https://parisnet.tzkt.io/${response.opHash}`)
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

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
import { useOperationError } from '@/providers/OperationErrorProvider'

interface ConfirmDelegateProps {
  spendableBalance: number
  handleOneStepForward: () => void
  selectedBaker: BakerInfo
  setSelectedBaker: (arg: BakerInfo | null) => void
  setDisableOnClick: (arg: boolean) => void
  setTzktLink: (arg: string) => void
}

export const ConfirmDelegate = ({
  spendableBalance,
  handleOneStepForward,
  selectedBaker,
  setSelectedBaker,
  setDisableOnClick,
  setTzktLink
}: ConfirmDelegateProps) => {
  const { Tezos } = useConnection()
  const { setoOerationErrorMessage } = useOperationError()

  return (
    <Flex flexDir='column' justify='center'>
      <Header py='24px'>Confirm</Header>
      <ColumnHeader pb='12px'>AVAILABLE</ColumnHeader>
      <BalanceBox balance={spendableBalance} />
      <ColumnHeader>Baker</ColumnHeader>
      <AddressBox address={selectedBaker.address} />
      <PrimaryButton
        onClick={async () => {
          setDisableOnClick(true)
          const response = await setDelegate(
            Tezos as TezosToolkit,
            selectedBaker.address
          )
          setDisableOnClick(false)

          if (response.success) {
            setTzktLink(`https://parisnet.tzkt.io/${response.opHash}`)
            setSelectedBaker(null)
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

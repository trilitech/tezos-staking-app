import React, { useState } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { setDelegate } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import {
  Header,
  ColumnHeader,
  AddressBox,
  BalanceBox
} from '@/components/modalBody'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'
import { BakerDetailsTable } from '@/components/modalBody/BakerDetailsTable'

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
  const { Tezos, beaconWallet } = useConnection()
  const { setMessage, setSuccess, setOpHash } = useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)

  return (
    <Flex flexDir='column' justify='center'>
      <Header pb='24px'>Confirm</Header>
      <ColumnHeader pb='12px'>SPENDABLE BALANCE</ColumnHeader>
      <BalanceBox balance={spendableBalance} />
      <ColumnHeader>Baker</ColumnHeader>
      <BakerDetailsTable
        alias={selectedBaker.alias}
        address={selectedBaker.address}
        fee={selectedBaker.stakingFees}
        acceptStaking={selectedBaker.acceptsStaking}
        capacity={selectedBaker.stakingFreeSpace}
      />
      <PrimaryButton
        onClick={async () => {
          if (!Tezos || !beaconWallet) {
            setErrorMessage('Wallet is not initialized, log out to try again.')
            return
          }

          setWaitingOperation(true)
          const response = await setDelegate(
            Tezos,
            selectedBaker.address,
            beaconWallet
          )
          setWaitingOperation(false)
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
        {waitingOperation ? <Spinner /> : 'Confirm'}
      </PrimaryButton>
      {!!errorMessage && <ErrorBlock errorMessage={errorMessage} />}
    </Flex>
  )
}

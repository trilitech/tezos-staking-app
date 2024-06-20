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
import { BeaconWallet } from '@taquito/beacon-wallet'

interface ConfirmDelegateProps {
  spendableBalance: number
  handleOneStepForward: () => void
  selectedBaker: BakerInfo
}

// Create a new component to display the baker's details
const BakerDetails = ({ baker }: { baker: BakerInfo }) => {
  console.log(baker)
  return (
    <div>
      <p>Accepts Staking: {baker.acceptsStaking ? 'Yes' : 'No'}</p>
      {baker.acceptsStaking && (
        <>
          <p>Staking Fees: {baker.stakingFees} %</p>
          <p>Remaining Staking Capacity: {baker.stakingFreeSpace} tz</p>
        </>
      )}
    </div>
  )
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
      <AddressBox address={selectedBaker.alias} />
      <BakerDetails baker={selectedBaker} />
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

import React, { useState } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { stake } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'

interface ConfirmAmountProps {
  spendableBalance: number
  stakedAmount: number
  setStakedAmount: (arg: number) => void
  handleOneStepForward: () => void
}

export const ConfirmAmount = ({
  spendableBalance,
  stakedAmount,
  setStakedAmount,
  handleOneStepForward
}: ConfirmAmountProps) => {
  const { Tezos, beaconWallet } = useConnection()
  const { setMessage, setSuccess, setOpHash } = useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)

  return (
    <Flex flexDir='column'>
      <Header mb='24px'>Confirm</Header>
      <ColumnHeader mb='12px'>SPENDABLE BALANCE</ColumnHeader>
      <BalanceBox balance={spendableBalance} />
      <ColumnHeader mb='12px'>STAKE AMOUNT</ColumnHeader>
      <BalanceBox balance={stakedAmount} />
      <PrimaryButton
        onClick={async () => {
          if (!Tezos || !beaconWallet) {
            setErrorMessage('Wallet is not initialized, log out to try again.')
            return
          }

          setWaitingOperation(true)
          const response = await stake(Tezos, stakedAmount, beaconWallet)
          setWaitingOperation(false)

          if (response.success) {
            setOpHash(response.opHash)
            setMessage(`You have successfully staked ${stakedAmount} ꜩ`)
            setSuccess(true)
            setStakedAmount(0)
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

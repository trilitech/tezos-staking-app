import React, { useState } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { finalizeUnstake } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { Header, BalanceBox, ColumnHeader } from '@/components/modalBody'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

interface ConfirmFinalizeUnstake {
  withdrawAmount: number
  handleOneStepForward: () => void
  spendableBalance: number
}

export const ConfirmFinalizeUnstake = ({
  withdrawAmount,
  handleOneStepForward,
  spendableBalance
}: ConfirmFinalizeUnstake) => {
  const { Tezos, beaconWallet } = useConnection()
  const { setMessage, setSuccess, setOpHash } = useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)

  return (
    <Flex flexDir='column' justify='center'>
      <Header mb='24px'>Finalize</Header>
      <ColumnHeader mb='12px'>SPENDABLE BALANCE</ColumnHeader>
      <BalanceBox balance={spendableBalance} />
      <ColumnHeader mb='12px'>FINALIZABLE BALANCE</ColumnHeader>
      <BalanceBox balance={withdrawAmount} />
      <PrimaryButton
        onClick={async () => {
          if (!Tezos || !beaconWallet) {
            setErrorMessage('Wallet is not initialized, log out to try again.')
            return
          }

          setWaitingOperation(true)
          const response = await finalizeUnstake(Tezos, beaconWallet)
          setWaitingOperation(false)

          if (response.success) {
            trackGAEvent(GAAction.BUTTON_CLICK, GACategory.FINALIZE_END)
            setOpHash(response.opHash)
            setMessage(
              `You have successfully finalized ${withdrawAmount} ꜩ. These funds are now part of your spendable balance.`
            )
            setSuccess(true)
            handleOneStepForward()
          } else {
            setErrorMessage(response.message)
          }
        }}
      >
        {waitingOperation ? <Spinner /> : 'Finalize'}
      </PrimaryButton>
      {!!errorMessage && <ErrorBlock errorMessage={errorMessage} />}
    </Flex>
  )
}

import React, { useState } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { setDelegate } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { AddressBox, Header, ColumnHeader } from '@/components/modalBody'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

interface ConfirmEndDelegate {
  spendableBalance: number
  handleOneStepForward: () => void
  bakerName: string
}

export const ConfirmEndDelegate = ({
  handleOneStepForward,
  bakerName
}: ConfirmEndDelegate) => {
  const { Tezos, beaconWallet } = useConnection()
  const { setMessage, setSuccess, setOpHash, setTitle } = useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)

  return (
    <Flex flexDir='column' justify='center'>
      <Header my='24px'>End Delegation</Header>

      <ColumnHeader mb='12px'>BAKER</ColumnHeader>
      <AddressBox address={bakerName} />
      <PrimaryButton
        onClick={async () => {
          if (!Tezos || !beaconWallet) {
            setErrorMessage('Wallet is not initialized, log out to try again.')
            return
          }

          setWaitingOperation(true)
          const response = await setDelegate(Tezos, undefined, beaconWallet)
          setWaitingOperation(false)
          if (response.success) {
            trackGAEvent(GAAction.BUTTON_CLICK, GACategory.END_DELEGATE_END)
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
        {waitingOperation ? <Spinner /> : 'End Delegation'}
      </PrimaryButton>
      {!!errorMessage && <ErrorBlock errorMessage={errorMessage} />}
    </Flex>
  )
}

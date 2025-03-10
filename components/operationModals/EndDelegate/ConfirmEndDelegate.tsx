import React, { useState } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { setDelegate } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import {
  AddressBox,
  Header,
  ColumnHeader,
  Description
} from '@/components/modalBody'
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
  const { setMessage, setSuccess, setOpHash, setTitle, setOpType } =
    useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)

  return (
    <Flex flexDir='column' justify='center'>
      <Header mt='24px' mb='15px'>
        End Delegation
      </Header>
      <Description mx='auto' mb='24px' w='100%' maxW='340px'>
        Ending your delegation means that you will no longer receive rewards
        from your baker.
      </Description>

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
              'You have successfully ended your delegation. You will no longer receive rewards on your tez.'
            )
            setSuccess(true)
            setOpType('end_delegate')
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

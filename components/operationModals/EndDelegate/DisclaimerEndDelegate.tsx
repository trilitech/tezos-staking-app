import React, { useState } from 'react'
import { Flex, Text, Checkbox, Image } from '@chakra-ui/react'
import { Header, Description } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'
import { useConnection } from '@/providers/ConnectionProvider'
import { stake } from '@/components/Operations/operations'
import { useOperationResponse } from '@/providers/OperationResponseProvider'

export const DisclaimerEndDelegate = ({
  handleOneStepForward
}: {
  handleOneStepForward: () => void
}) => {
  const { Tezos, beaconWallet } = useConnection()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)
  const { setMessage, setSuccess, setOpHash, setOpType } =
    useOperationResponse()

  const [isChecked, setIsChecked] = useState(false)

  return (
    <Flex flexDir='column' alignItems='center'>
      <Image w='25px' mb='15px' src='/images/error-icon.svg' alt='alert icon' />
      <Header mb='15px'>Important Notice</Header>
      <Description mb={['30px', null, '24px']} maxW='340px'>
        Ending your delegation with a baker while staking with them will
        automatically unstake your entire staked balance. This balance will be
        made available after approximately 10 days.
      </Description>
      <PrimaryButton
        onClick={async () => {
          handleOneStepForward()
        }}
      >
        I Understand
      </PrimaryButton>
    </Flex>
  )
}

import React, { useState } from 'react'
import { Flex, Text, Checkbox, Image } from '@chakra-ui/react'
import { Header, Description } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'
import { useConnection } from '@/providers/ConnectionProvider'
import { stake } from '@/components/Operations/operations'
import { useOperationResponse } from '@/providers/OperationResponseProvider'

export const DisclaimerStaking = ({
  stakedAmount,
  handleOneStepForward
}: {
  stakedAmount: number
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
      <Image w='25px' mb='15px' src='/images/alert-icon.svg' alt='alert icon' />
      <Header mb='15px'>Disclaimer</Header>
      <Description maxW='320px'>
        Staked balances are locked in your account until they are manually
        unstaked and finalized. You need to wait 4 cycles to finalize after an
        unstake.
        <br />
        <br />
        Staked funds are at risk. You might lose a portion of your stake if the
        chosen baker is slashed for not following Tezos consensus mechanism
        rules.
      </Description>
      <Flex
        gap='24px'
        my='24px'
        bg='#EDF2F7'
        borderRadius='10px'
        py='16px'
        px='22px'
      >
        <Checkbox
          isChecked={isChecked}
          onChange={() => {
            trackGAEvent(GAAction.BUTTON_CLICK, GACategory.ACCEPT_DISCLAIMER)
            setIsChecked(!isChecked)
          }}
        />
        <Text
          color='#2D3748'
          fontSize='16px'
          fontWeight={400}
          lineHeight='22px'
        >
          I confirm that I have read and agreed with the{' '}
          <Text as='span' textDecor='underline' _hover={{ cursor: 'pointer' }}>
            Terms of Use.
          </Text>
        </Text>
      </Flex>
      <PrimaryButton
        disabled={!isChecked}
        // onClick={() => {
        //   trackGAEvent(GAAction.BUTTON_CLICK, GACategory.CONTINUE_STAKE)
        //   handleOneStepForward()
        // }}
        onClick={async () => {
          if (!Tezos || !beaconWallet) {
            setErrorMessage('Wallet is not initialized, log out to try again.')
            return
          }

          trackGAEvent(GAAction.BUTTON_CLICK, GACategory.START_STAKE_BEGIN)

          setWaitingOperation(true)
          const response = await stake(Tezos, stakedAmount, beaconWallet)
          setWaitingOperation(false)

          if (response.success) {
            trackGAEvent(GAAction.BUTTON_CLICK, GACategory.START_STAKE_END)
            setOpHash(response.opHash)
            setOpType('stake')
            setMessage(`You have successfully staked ${stakedAmount} ꜩ.`)
            setSuccess(true)
            setStakedAmount(0)
            handleOneStepForward()
          } else {
            setErrorMessage(response.message)
          }
        }}
      >
        Stake
      </PrimaryButton>
    </Flex>
  )
}

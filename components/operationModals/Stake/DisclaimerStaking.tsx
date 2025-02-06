import React, { useState } from 'react'
import { Flex, Text, Checkbox, Image, Spinner } from '@chakra-ui/react'
import { Header, Description } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'
import { useConnection } from '@/providers/ConnectionProvider'
import { stake } from '@/components/Operations/operations'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'

export const DisclaimerStaking = ({
  stakedAmount,
  openedFromStartEarning,
  handleOneStepForward,
  setStakedAmount
}: {
  stakedAmount: number
  openedFromStartEarning: boolean
  handleOneStepForward: () => void
  setStakedAmount: (arg: number) => void
}) => {
  const { Tezos, beaconWallet } = useConnection()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)
  const { setMessage, setSuccess, setAmount, setOpHash, setOpType } =
    useOperationResponse()

  const [isChecked, setIsChecked] = useState(false)

  return (
    <Flex flexDir='column' alignItems='center'>
      <Image w='25px' mb='15px' src='/images/error-icon.svg' alt='alert icon' />
      <Header mb='15px'>Disclaimer</Header>
      <Description w='340px'>
        Staked balances are locked in your account until they are manually
        unstaked which will take approximately 10 days to be finalized.
        <br />
        <br />
        Staked funds are at risk. You might lose a portion of your stake if the
        chosen baker is <u>slashed</u> for not following{' '}
        <u>Tezos consensus mechanism rules</u>.
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
            setMessage(
              `You have successfully staked ${stakedAmount} ꜩ. ${openedFromStartEarning ? 'Your remaining funds will be automatically delegated to the baker.' : 'Your rewards will now accrue automatically within your staked amount.'} `
            )
            setSuccess(true)
            setAmount(stakedAmount)
            setStakedAmount(0)
            handleOneStepForward()
          } else {
            setErrorMessage(response.message)
          }
        }}
      >
        {waitingOperation ? <Spinner /> : 'Stake'}
      </PrimaryButton>
      {!!errorMessage && <ErrorBlock errorMessage={errorMessage} />}
    </Flex>
  )
}

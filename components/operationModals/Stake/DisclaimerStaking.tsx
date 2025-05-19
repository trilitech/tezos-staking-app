import React, { useState } from 'react'
import { Flex, Text, Checkbox, Image, Spinner } from '@chakra-ui/react'
import { Header, Description } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'
import { useConnection } from '@/providers/ConnectionProvider'
import { stake } from '@/components/Operations/operations'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'
import Link from 'next/link'

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
      <Description
        w='340px'
        css={{ a: { textDecoration: 'underline', textUnderlineOffset: '15%' } }}
      >
        Staked balances are locked in your account until they are manually
        unstaked, which will take {process.env.NEXT_PUBLIC_UNSTAKE_DAYS} days to
        be finalized.
        <br />
        <br />
        Staked funds are exposed to slashing risks. You might lose a portion of
        your stake if the chosen baker is{' '}
        <a
          target='_blank'
          href='https://octez.tezos.com/docs/active/consensus.html#slashing'
        >
          slashed
        </a>{' '}
        for not following{' '}
        <a
          target='_blank'
          href='https://octez.tezos.com/docs/active/consensus.html'
        >
          Tezos consensus mechanism rules
        </a>
        .
      </Description>
      <Flex
        gap='24px'
        my='24px'
        bg='gray.100'
        borderRadius='10px'
        py='16px'
        px='22px'
      >
        <Checkbox.Root
          checked={isChecked}
          onChange={() => {
            trackGAEvent(GAAction.BUTTON_CLICK, GACategory.ACCEPT_DISCLAIMER)
            setIsChecked(!isChecked)
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
        <Text
          color='gray.700'
          fontSize='16px'
          fontWeight={400}
          lineHeight='22px'
        >
          I confirm that I have read and agreed with the{' '}
          <Text
            textDecor='underline'
            textUnderlineOffset='15%'
            _hover={{ cursor: 'pointer' }}
            asChild
          >
            <Link href='/termsOfUseStakingApp/' target='_blank'>
              Terms of Use.
            </Link>
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
              `You have successfully staked ${stakedAmount} tez. ${openedFromStartEarning ? 'Your remaining funds will be automatically delegated to the baker.' : 'Your rewards will now accrue automatically within your staked amount.'} `
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

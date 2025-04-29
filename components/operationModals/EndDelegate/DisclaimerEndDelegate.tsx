import React from 'react'
import { Flex, Image } from '@chakra-ui/react'
import { Header, Description } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { GAAction, GACategory, trackGAEvent } from '@/utils/trackGAEvent'

export const DisclaimerEndDelegate = ({
  handleOneStepForward
}: {
  handleOneStepForward: () => void
}) => {
  return (
    <Flex flexDir='column' alignItems='center'>
      <Image w='25px' mb='15px' src='/images/error-icon.svg' alt='alert icon' />
      <Header mb='15px'>Important Notice</Header>
      <Description mb={['30px', null, '24px']} maxW='340px'>
        Ending your delegation with a baker while staking with them will automatically unstake your entire staked balance.
        <br />
        <br />
        While you may delegate to a new baker immediately, you will need to first finalize unstaking with your original baker before you can stake again. To do so, come back in {process.env.NEXT_PUBLIC_UNSTAKE_DAYS} days and finalize the process via the main dashboard.
      </Description>
      <PrimaryButton
        onClick={async () => {
          trackGAEvent(GAAction.BUTTON_CLICK, GACategory.CHOOSE_I_UNDERSTAND)
          handleOneStepForward()
        }}
      >
        I Understand
      </PrimaryButton>
    </Flex>
  )
}

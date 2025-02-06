import React from 'react'
import { Flex, Image } from '@chakra-ui/react'
import { Header, Description } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { RoundBorderText } from '../Delegate/DelegateStart'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

export const UnstakeStart = ({
  handleOneStepForward
}: {
  handleOneStepForward: () => void
}) => {
  return (
    <Flex flexDir='column' alignItems='center'>
      <Image w='25px' mb='15px' src='/images/error-icon.svg' alt='alert icon' />
      <Header mb='15px'>Important Notice</Header>
      <Description mb='24px'>
        Unstaking takes approximately 10 days, after which you must finalize the
        process. Once you do, your tez will be made available in your spendable
        balance.
      </Description>
      <PrimaryButton
        onClick={() => {
          trackGAEvent(GAAction.BUTTON_CLICK, GACategory.CHOOSE_I_UNDERSTAND)
          handleOneStepForward()
        }}
      >
        I Understand
      </PrimaryButton>
    </Flex>
  )
}

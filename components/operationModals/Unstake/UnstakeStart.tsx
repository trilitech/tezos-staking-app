import React from 'react'
import { Flex, Image } from '@chakra-ui/react'
import { Header, Description } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { RoundBorderText } from '../Delegate/DelegateStart'

export const UnstakeStart = ({
  handleOneStepForward
}: {
  handleOneStepForward: () => void
}) => {
  return (
    <Flex flexDir='column' alignItems='center'>
      <Image w='25px' mb='15px' src='/images/alert-icon.svg' alt='alert icon' />
      <Header mb='15px'>Important Notice</Header>
      <Description mb='24px'>
        After submitting an unstake, the chosen amount will become finalizable
        after 4 cycles (~10 days). Then, you will need to finalize unstaked
        balances in order to make them spendable.
      </Description>
      <Flex mb='24px' fontSize={['14px', '16px']}>
        <RoundBorderText step={1} text='UNSTAKE' />
        <RoundBorderText step={2} text='FINALIZE' />
      </Flex>
      <PrimaryButton onClick={handleOneStepForward}>I Understand</PrimaryButton>
    </Flex>
  )
}

import React from 'react'
import { Flex, Image } from '@chakra-ui/react'
import { Header, Description } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'

export const ChangeStart = ({
  handleOneStepForward
}: {
  handleOneStepForward: () => void
}) => {
  return (
    <Flex flexDir='column' alignItems='center'>
      <Image w='25px' mb='15px' src='/images/alert-icon.svg' alt='alert icon' />
      <Header mb='15px'>Important Notice</Header>
      <Description mb='24px' maxW='340px'>
        Changing the baker will automatically unstake all the existing staked
        balance. This balance will be finalizable after 4 cycles.
      </Description>
      <PrimaryButton onClick={handleOneStepForward}>I Understand</PrimaryButton>
    </Flex>
  )
}

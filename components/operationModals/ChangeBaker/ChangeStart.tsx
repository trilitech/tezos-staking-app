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
      <Image w='25px' mb='15px' src='/images/error-icon.svg' alt='alert icon' />
      <Header mb='15px'>Important Notice</Header>
      <Description mb='24px' maxW='340px'>
        Changing your baker will automatically unstake your entire staked
        balance. This balance will be made available once you finalize the
        process after approximately 10 days.
      </Description>
      <PrimaryButton onClick={handleOneStepForward}>I Understand</PrimaryButton>
    </Flex>
  )
}

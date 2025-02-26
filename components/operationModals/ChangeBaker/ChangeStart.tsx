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
        Changing your baker while staking with them will automatically unstake your entire staked balance.
        <br />
        <br />
        If you would like to stake with your new baker, you will need to come back in approximately 10 days to first finalize the unstaking process via the main dashboard.
      </Description>
      <PrimaryButton onClick={handleOneStepForward}>I Understand</PrimaryButton>
    </Flex>
  )
}

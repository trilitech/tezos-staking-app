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
      <Image
        w='25px'
        mt='24px'
        mb='15px'
        src='/images/alert-icon.svg'
        alt='alert icon'
      />
      <Header mb='15px'>Important Notice</Header>
      <Description mb='24px' maxW='340px'>
        Changing bakers will automatically unstake any funds staked while
        delegating to the previous baker. You will need to finalize them before
        being able to stake these funds again.
      </Description>
      <PrimaryButton onClick={handleOneStepForward}>I Understand</PrimaryButton>
    </Flex>
  )
}

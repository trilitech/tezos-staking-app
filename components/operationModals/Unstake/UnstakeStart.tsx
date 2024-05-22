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
      <Image
        w='25px'
        mt='24px'
        mb='15px'
        src='/images/alert-icon.svg'
        alt='alert icon'
      />
      <Header mb='15px'>Important Notice</Header>
      <Description mb='24px'>
        You need to unstake first and wait for the next cycle to finalize and
        withdraw your frozen tez back to your balance
      </Description>
      <Flex mb='24px' gap='10px' fontSize={['14px', '16px']}>
        <RoundBorderText step={1} text='UNSTAKE' />
        <RoundBorderText step={2} text='FINALIZE' />
      </Flex>
      <PrimaryButton onClick={handleOneStepForward}>I Understand</PrimaryButton>
    </Flex>
  )
}

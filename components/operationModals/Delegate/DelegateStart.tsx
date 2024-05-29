import React from 'react'
import { Image, Box, Flex, Text } from '@chakra-ui/react'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { Header, Description } from '@/components/modalBody'

export const DelegateStart = ({
  handleOneStepForward
}: {
  handleOneStepForward: () => void
}) => {
  return (
    <Flex flexDir='column' justify='center' alignItems='center'>
      <Image
        src='/images/stepper/info-icon.svg'
        alt='info icon'
        pt='20px'
        pb='16px'
      />
      <Header mb='10px'>Delegation</Header>
      <Description>
        Earn rewards while retaining lower risk of your funds by delegating to a
        Tezos baker.
      </Description>
      <Flex pt='20px' mb='30px' gap='10px' fontSize={['14px', '16px']}>
        <RoundBorderText step={1} text='DELEGATE' />
        <RoundBorderText step={2} text='STAKE TEZ' />
      </Flex>
      <PrimaryButton onClick={handleOneStepForward}>Continue</PrimaryButton>
    </Flex>
  )
}

export const RoundBorderText = ({
  text,
  step
}: {
  text: string
  step: number
}) => {
  return (
    <Flex
      justify='center'
      alignItems='center'
      gap='10px'
      border='1px solid #E2E8F0'
      borderRadius='100px'
      px='10px'
      py='10px'
    >
      <Box border='solid 1px #EDF2F7' borderRadius={100} px='8px'>
        {step}
      </Box>
      <Text>{text}</Text>
    </Flex>
  )
}

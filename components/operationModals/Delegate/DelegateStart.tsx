import React from 'react'
import { Image, Box, Flex, Text } from '@chakra-ui/react'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { Header, Description } from '@/components/modalBody'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

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
        pt='5px'
        pb='16px'
      />
      <Header mb='16px'>Delegation</Header>
      <Description>
        Earn risk-free rewards by delegating to a Tezos baker. Delegated funds
        remain in your account, and you can always spend them at will.
      </Description>
      <Flex pt='24px' mb='30px' fontSize={['14px', '16px']}>
        <RoundBorderText step={1} text='DELEGATE' />
        <RoundBorderText step={2} text='STAKE TEZ' />
      </Flex>
      <PrimaryButton
        onClick={() => {
          trackGAEvent(GAAction.BUTTON_CLICK, GACategory.CONTINUE_DELEGATION)
          handleOneStepForward()
        }}
      >
        Continue
      </PrimaryButton>
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
    <Flex>
      <Flex
        justify='center'
        alignItems='center'
        gap='10px'
        border='1px solid #E2E8F0'
        borderRadius='100px'
        px='14px'
        py='10px'
        fontSize='14px'
        fontWeight={600}
        lineHeight='18px'
        color='#4A5568'
      >
        <Box border='solid 1px #EDF2F7' borderRadius={100} px='8px' py='4px'>
          {step}
        </Box>
        <Text>{text}</Text>
      </Flex>
      {step === 1 && <Image src='/images/vector.svg' alt='line' />}
    </Flex>
  )
}

import React from 'react'
import { Image, Box, Flex, Text, Link } from '@chakra-ui/react'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { Header, Description } from '@/components/modalBody'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

export const StakeStart = ({
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
      <Header mb='16px'>Staking</Header>
      <Description>
        In order to stake, you need to delegate your balance to a Tezos baker
        first. Delegated funds remain in your account.
      </Description>
      <Flex
        justifyContent='center'
        gap={[3, 0]}
        flexWrap={['wrap', 'nowrap']}
        pt='24px'
        mb='30px'
        fontSize={['14px', '16px']}
      >
        <RoundBorderText step={1} text='SELECT BAKER' />
        <RoundBorderText step={2} text='STAKE YOUR TEZ' />
      </Flex>
      <PrimaryButton
        onClick={() => {
          trackGAEvent(GAAction.BUTTON_CLICK, GACategory.CONTINUE_DELEGATION)
          handleOneStepForward()
        }}
        w='full'
      >
        Select Baker
      </PrimaryButton>
      <Flex pt='24px' gap={1} flexDir='column' textAlign='center' maxW='640px'>
        <Link href='/faqs#delegating' target='_blank'>
          <Text
            fontSize='sm'
            display='flex'
            gap={1}
            cursor='pointer'
            color='gray.700'
            fontWeight='semibold'
          >
            Tips for choosing your baker
            <Image
              maxW='110px'
              src='/images/external-link.svg'
              alt='External Link'
            />
          </Text>
        </Link>
      </Flex>
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
    <Flex alignItems='center'>
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
        color='gray.600'
      >
        <Box border='solid 1px #EDF2F7' borderRadius={100} px='8px' py='4px'>
          {step}
        </Box>
        <Text>{text}</Text>
      </Flex>
      {step === 1 && (
        <Image
          display={['none', 'block']}
          src='/images/vector.svg'
          alt='line'
        />
      )}
    </Flex>
  )
}

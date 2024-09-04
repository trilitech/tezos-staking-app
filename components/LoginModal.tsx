import React from 'react'
import { Box, Flex, Image, Text, FlexProps } from '@chakra-ui/react'
import Link from 'next/link'
import { PrimaryButton } from './buttons/PrimaryButton'
import { useConnection } from '@/providers/ConnectionProvider'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

const STEPS = ['DELEGATE', 'STAKE', 'EARN']

export const LoginModal = () => {
  const { connect } = useConnection()

  return (
    <Flex
      pos='relative'
      justify='center'
      alignItems='center'
      flexDir='column'
      bg='white'
      minW='300px'
      minH='300px'
      boxShadow='0px 2px 20px 0px rgba(45, 55, 72, 0.15)'
      borderRadius='16px'
      px={['24px', '50px', '80px', '110px']}
      py={['40px', '60px', '80px']}
    >
      <Image mb='24px' maxW='110px' src='/images/logo.svg' alt='Tezos Logo' />
      <Text
        fontSize={['24px', '30px']}
        fontWeight={600}
        maxW='380px'
        textAlign='center'
        lineHeight='36px'
        mb={['30px', '40px']}
        color='#171923'
      >
        Stake on Tezos to Earn Rewards
      </Text>
      <Flex
        mb={['30px', '40px']}
        display={['none', null, 'flex']}
        fontWeight={600}
        fontSize='14px'
      >
        {STEPS.map((data, index) => (
          <TextBox text={data} step={index + 1} key={index} />
        ))}
      </Flex>
      <MobileSteps display={['flex', null, 'none']} mb='40px' />
      <PrimaryButton
        w={['100%', '170px']}
        mb='24px'
        onClick={() => {
          trackGAEvent(GAAction.BUTTON_CLICK, GACategory.WALLET_BEGIN)
          connect()
        }}
      >
        Connect Wallet
      </PrimaryButton>
      <Link href='https://spotlight.tezos.com/how-to-stake/' target='_blank'>
        <Text
          fontWeight={600}
          fontSize='16px'
          textDecor='underline'
          _hover={{ color: '#003EE0' }}
          transition='color 0.2s ease-in-out'
        >
          Learn more
        </Text>
      </Link>
    </Flex>
  )
}

const TextBox = ({
  text,
  step,
  ...styles
}: {
  text: string
  step: number
} & FlexProps) => {
  return (
    <Flex {...styles}>
      <Flex
        justify='center'
        alignItems='center'
        gap='10px'
        border='1px solid #E2E8F0'
        borderRadius='100px'
        px='20px'
        py='10px'
        whiteSpace='nowrap'
      >
        <Box border='solid 1px #EDF2F7' borderRadius={100} px='8px'>
          {step}
        </Box>
        <Text>{text}</Text>
      </Flex>
      {step !== 3 && <Image src='/images/vector.svg' alt='line' />}
    </Flex>
  )
}

const MobileSteps = ({ ...styles }: FlexProps) => {
  return (
    <Flex flexDir='column' {...styles}>
      <Flex mb='10px'>
        {STEPS.map((_, index) => (
          <Flex key={index}>
            <Text
              border='solid 1px #EDF2F7'
              borderRadius='100%'
              fontWeight={600}
              px={index === 0 ? '10px' : '9px'}
              py='4px'
              fontSize='14px'
              lineHeight='18px'
              color='#4A5568'
            >
              {index + 1}
            </Text>
            {index !== 2 && <Image src='/images/long-vector.svg' alt='line' />}
          </Flex>
        ))}
      </Flex>
      <Flex justify='space-between' w='110%' pos='relative' right='10px'>
        {STEPS.map((data, index) => (
          <Text
            fontWeight={600}
            fontSize='14px'
            lineHeight='18px'
            color='#4A5568'
            key={index}
          >
            {data}
          </Text>
        ))}
      </Flex>
    </Flex>
  )
}

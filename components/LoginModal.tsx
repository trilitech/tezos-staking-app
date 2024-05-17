import React from 'react'
import { Box, Flex, Image, Text, FlexProps } from '@chakra-ui/react'
import Link from 'next/link'
import { ConnectButton } from '@/components/buttons/ConnectButton'

const STEPS = ['DELEGATE', 'STAKE TEZ', 'EARN TEZ']

export const LoginModal = () => {
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
      >
        Earn rewards with Tezos staking solutions
      </Text>
      <Flex mb={['30px', '40px']} display={['none', null, 'flex']}>
        {STEPS.map((data, index) => (
          <TextBox text={data} step={index + 1} key={index} />
        ))}
      </Flex>
      <MobileSteps display={['flex', null, 'none']} mb='20px' />
      <ConnectButton mb='24px' />
      <Link href='/'>
        <Text fontWeight={600} fontSize='16px' textDecor='underline'>
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
    <Flex justify='space-around' w='100%' {...styles}>
      {STEPS.map((data, index) => (
        <Flex flexDir='column' key={index}>
          <Flex justify='center' alignItems='center' w='100%'>
            <Text
              border='solid 1px #EDF2F7'
              borderRadius={100}
              px='10px'
              py='2px'
              fontSize='14px'
            >
              {index + 1}
            </Text>
          </Flex>
          <Text fontSize='14px' color='#4A5568'>
            {data}
          </Text>
        </Flex>
      ))}
    </Flex>
  )
}

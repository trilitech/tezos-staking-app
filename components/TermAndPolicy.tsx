import React from 'react'
import { Flex, Text, FlexProps, TextProps } from '@chakra-ui/react'
import Link from 'next/link'
import { useConnection } from '@/providers/ConnectionProvider'

export const TermAndPolicy = ({ ...styles }: FlexProps) => {
  const { isConnected } = useConnection()

  return (
    <Flex
      flexDir={['column', 'row']}
      justify='space-between'
      w='100%'
      alignItems='center'
      fontSize='14px'
      gap='24px'
      fontWeight={400}
      {...styles}
    >
      <Text color={isConnected ? '#2D3748' : '#FFFFFF'}>
        © 2024 Tezos <Divider mx='5px' /> Terms <Divider mx='5px' /> Privacy
      </Text>

      <Text color={isConnected ? '#718096' : '#E2E8F0'}>
        Powered by{' '}
        <Link href='https://tezos.com' target='_blank'>
          <Text
            as='span'
            textDecor='underline'
            _hover={{ color: 'white' }}
            transition='color 0.2s ease-in-out'
          >
            Tezos
          </Text>
        </Link>
      </Text>
    </Flex>
  )
}

const Divider = ({ ...styles }: TextProps) => {
  const { isConnected } = useConnection()

  return (
    <Text
      as='span'
      fontWeight={400}
      color={isConnected ? '#CBD5E0' : '#718096'}
      {...styles}
    >
      |
    </Text>
  )
}

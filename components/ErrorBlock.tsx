import React from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'

export const ErrorBlock = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <Flex
      alignItems='center'
      gap='12px'
      p='16px'
      bg='#FFD4D4'
      mt='24px'
      borderLeft='4px solid #E53E3E'
    >
      <Image src='/images/AlertIcon.svg' alt='alert icon' />
      <Text fontSize='14px' fontWeight={400} color='#2D3748'>
        {errorMessage}
      </Text>
    </Flex>
  )
}

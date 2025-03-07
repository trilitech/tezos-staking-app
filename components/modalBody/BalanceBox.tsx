import React from 'react'
import { Flex, Text, Image, FlexProps, Spinner } from '@chakra-ui/react'
import { mutezToTez } from '@/utils/mutezToTez'

type Status = 'success' | 'pending' | 'error'

export const BalanceBox = ({
  balance,
  ...styles
}: {
  balance: number
} & FlexProps) => {
  return (
    <Flex flexDir='column' gap='12px' mb='30px' {...styles}>
      <Flex
        justify='space-between'
        alignItems='center'
        borderRadius='8px'
        w='100%'
        py='12px'
        px='16px'
        bg='gray.100'
      >
        <Text fontWeight={600} color='gray.600' fontSize='16px'>
          {balance}
        </Text>
        <Image src='/images/xtz-icon.svg' alt='xtz icon' />
      </Flex>
    </Flex>
  )
}

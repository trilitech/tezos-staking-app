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
    <Flex flexDir='column' gap='12px' {...styles}>
      <Flex
        justify='space-between'
        alignItems='center'
        borderRadius='8px'
        w='100%'
        py='12px'
        px='16px'
        bg='#EDF2F7'
      >
        <Text fontWeight={600} color='#4A5568' fontSize='16px'>
          {balance}
        </Text>
        <Image src='/images/xtz-icon.svg' alt='xtz icon' />
      </Flex>
    </Flex>
  )
}

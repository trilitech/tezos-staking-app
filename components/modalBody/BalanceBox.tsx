import React from 'react'
import { Flex, Text, Image, FlexProps } from '@chakra-ui/react'

export const BalanceBox = ({
  balance,
  fee,
  ...styles
}: {
  balance: number
  fee?: number
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
      {fee && (
        <Text fontWeight={600} alignSelf='end' fontSize='14px'>
          <Text as='span' color='#4A5568'>
            FEE:
          </Text>{' '}
          {fee}{' '}
          <Text as='span' color='#10121B' fontWeight={400}>
            ꜩ
          </Text>
        </Text>
      )}
    </Flex>
  )
}

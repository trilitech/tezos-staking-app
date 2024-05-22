import React from 'react'
import { Flex, Text, Image, FlexProps } from '@chakra-ui/react'

export const BalanceBox = ({
  balance,
  ...styles
}: { balance: number } & FlexProps) => {
  return (
    <Flex
      justify='space-between'
      alignItems='center'
      borderRadius='8px'
      w='100%'
      py='12px'
      px='16px'
      bg='#EDF2F7'
      mb='30px'
      {...styles}
    >
      <Text>{balance}</Text>
      <Image src='/images/xtz-icon.svg' alt='xtz icon' />
    </Flex>
  )
}

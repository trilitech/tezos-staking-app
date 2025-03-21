import React from 'react'
import { Text, TextProps } from '@chakra-ui/react'

export const Description = ({
  children,
  ...styles
}: {
  children: React.ReactNode
} & TextProps) => {
  return (
    <Text
      w={['310px', null, '360px']}
      fontSize='16px'
      fontWeight={400}
      color='gray.700'
      textAlign='center'
      {...styles}
    >
      {children}
    </Text>
  )
}

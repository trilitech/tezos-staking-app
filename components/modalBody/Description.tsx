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
      maxW='250px'
      fontSize='16px'
      fontWeight={400}
      color='#2D3748'
      textAlign='center'
      {...styles}
    >
      {children}
    </Text>
  )
}

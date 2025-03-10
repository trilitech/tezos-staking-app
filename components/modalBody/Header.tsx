import React from 'react'
import { Text, TextProps } from '@chakra-ui/react'

export const Header = ({
  children,
  ...styles
}: {
  children: React.ReactNode
} & TextProps) => {
  return (
    <Text
      color='gray.900'
      fontSize='20px'
      fontWeight={600}
      textAlign='center'
      lineHeight='26px'
      {...styles}
    >
      {children}
    </Text>
  )
}

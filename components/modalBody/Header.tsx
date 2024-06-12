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
      color='#171923'
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

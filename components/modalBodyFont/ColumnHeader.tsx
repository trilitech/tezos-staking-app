import React from 'react'
import { Text, TextProps } from '@chakra-ui/react'

export const ColumnHeader = ({
  children,
  ...styles
}: {
  children: React.ReactNode
} & TextProps) => {
  return (
    <Text fontSize='14px' fontWeight={600} color='#4A5568' {...styles}>
      {children}
    </Text>
  )
}

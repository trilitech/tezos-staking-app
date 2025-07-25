import React from 'react'
import { Button, ButtonProps } from '@chakra-ui/react'

export const SecondaryButton = ({
  children,
  onClick,
  disabled,
  ...styles
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
} & ButtonProps) => {
  return (
    <Button
      bg={disabled ? 'gray.200' : 'white'}
      color={disabled ? 'gray.400' : 'blue'}
      border={disabled ? 'gray.200' : '#0052FF 2px solid'}
      borderRadius='8px'
      fontWeight={600}
      fontSize='18px'
      h='48px'
      px='24px'
      lineHeight='24px'
      _hover={{
        bg: disabled ? 'gray.200' : 'blue',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'gray.400' : 'white'
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...styles}
    >
      {children}
    </Button>
  )
}

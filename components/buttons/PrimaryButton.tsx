import React from 'react'
import { Button, ButtonProps } from '@chakra-ui/react'

export const PrimaryButton = ({
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
      bg={disabled ? 'gray.200' : 'blue'}
      color={disabled ? 'gray.400' : 'white'}
      borderRadius='8px'
      fontWeight={600}
      fontSize='18px'
      h='48px'
      px='24px'
      lineHeight='24px'
      _hover={{
        bg: disabled ? 'gray.200' : 'darkBlue',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...styles}
    >
      {children}
    </Button>
  )
}

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
      w='100%'
      bg={disabled ? '#E2E8F0' : 'white'}
      color={disabled ? '#A0AEC0' : '#0052FF'}
      border={disabled ? '#E2E8F0' : '#0052FF 2px solid'}
      fontWeight={600}
      fontSize='18px'
      py='16px'
      _hover={{
        bg: disabled ? '#E2E8F0' : 'white',
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

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
      w='100%'
      bg={disabled ? '#E2E8F0' : '#0052FF'}
      color={disabled ? '#A0AEC0' : 'white'}
      fontWeight={600}
      fontSize='18px'
      h='48px'
      px='24px'
      lineHeight='24px'
      _hover={{
        bg: disabled ? '#E2E8F0' : '#003EE0',
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

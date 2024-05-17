import React from 'react'
import { Button, ButtonProps } from '@chakra-ui/react'

export const DisconnectButton = ({
  onClick,
  ...styles
}: { onClick: () => void } & ButtonProps) => {
  return (
    <Button {...styles} onClick={onClick}>
      Disconnect
    </Button>
  )
}

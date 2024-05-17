import React from 'react'
import { Button, ButtonProps } from '@chakra-ui/react'
import { useConnection } from '@/components/ConnectionProvider'

export const DisconnectButton = ({ ...styles }: {} & ButtonProps) => {
  const { disconnect } = useConnection()

  return (
    <Button {...styles} onClick={() => disconnect()}>
      Disconnect
    </Button>
  )
}

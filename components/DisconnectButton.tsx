import React from 'react'
import { Button } from '@chakra-ui/react'
import { useConnection } from '@/components/ConnectionProvider'

export const DisconnectButton = () => {
  const { disconnect } = useConnection()

  return <Button onClick={() => disconnect()}>Disconnect</Button>
}

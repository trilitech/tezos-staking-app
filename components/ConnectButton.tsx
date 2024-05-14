import React from 'react'
import { Button } from '@chakra-ui/react'
import { useConnection } from '@/components/ConnectionProvider'

export const ConnectButton = () => {
  const { connect } = useConnection()

  return <Button onClick={() => connect()}>Connect</Button>
}

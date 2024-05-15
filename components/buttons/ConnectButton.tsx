import React from 'react'
import { Button, ButtonProps } from '@chakra-ui/react'
import { useConnection } from '@/components/ConnectionProvider'

export const ConnectButton = ({ ...styles }: ButtonProps) => {
  const { connect } = useConnection()

  return (
    <Button
      px='24px'
      bg='#0052FF'
      color='white'
      borderRadius='10px'
      onClick={() => connect()}
      _hover={{
        bg: '#0052FF'
      }}
      {...styles}
    >
      Connect Wallet
    </Button>
  )
}

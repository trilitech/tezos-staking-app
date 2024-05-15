import React from 'react'
import { Button, ButtonProps } from '@chakra-ui/react'
import { useConnection } from '@/components/ConnectionProvider'

export const DisconnectButton = ({
  setError,
  ...styles
}: {
  setError?: (error: boolean) => void
} & ButtonProps) => {
  const { disconnect } = useConnection()

  return (
    <Button
      {...styles}
      onClick={() => {
        disconnect()
        if (setError) setError(false)
      }}
    >
      Disconnect
    </Button>
  )
}

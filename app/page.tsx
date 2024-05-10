'use client'
import { Spinner, Text } from '@chakra-ui/react'
import { useConnection } from '@/components/ConnectionProvider'
import { ConnectButton } from '@/components/ConnectButton'
import { DisconnectButton } from '@/components/DisconnectButton'

export default function Home() {
  const { address, isConnected } = useConnection()

  return (
    <div>
      <Text>{isConnected && `Your address is ${address}`}</Text>
      {isConnected === undefined ? (
        <Spinner />
      ) : isConnected ? (
        <DisconnectButton />
      ) : (
        <ConnectButton />
      )}
    </div>
  )
}

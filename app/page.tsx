'use client'
import { Spinner } from '@chakra-ui/react'
import { useConnection } from '@/components/ConnectionProvider'
import { ConnectButton } from '@/components/ConnectButton'
import { DisconnectButton } from '@/components/DisconnectButton'

export default function Home() {
  const { address, isConnected } = useConnection()

  return (
    <div>
      {isConnected && `Your address is ${address}`}
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

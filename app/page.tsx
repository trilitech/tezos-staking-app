'use client'
import { Button } from '@chakra-ui/react'
import { useConnection } from '@/components/ConnectionProvider'

export default function Home() {
  const { address, connect } = useConnection()

  return (
    <div>
      {address ? (
        `You're connected: ${address}`
      ) : (
        <Button onClick={() => connect('beacon')}>Connect</Button>
      )}
    </div>
  )
}

'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { ConnectionProvider } from '@/components/ConnectionProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConnectionProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </ConnectionProvider>
  )
}

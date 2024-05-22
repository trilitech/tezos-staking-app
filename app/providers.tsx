'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { ConnectionProvider } from '@/components/ConnectionProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider>
        <ChakraProvider>{children}</ChakraProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  )
}

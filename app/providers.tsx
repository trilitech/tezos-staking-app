'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { ConnectionProvider } from '@/providers/ConnectionProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OperationResponseProvider } from '@/providers/OperationResponseProvider'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OperationResponseProvider>
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider>
          <ChakraProvider>{children}</ChakraProvider>
        </ConnectionProvider>
      </QueryClientProvider>
    </OperationResponseProvider>
  )
}

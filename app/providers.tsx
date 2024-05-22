'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { ConnectionProvider } from '@/providers/ConnectionProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OperationErrorProvider } from '@/providers/OperationErrorProvider'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OperationErrorProvider>
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider>
          <ChakraProvider>{children}</ChakraProvider>
        </ConnectionProvider>
      </QueryClientProvider>
    </OperationErrorProvider>
  )
}

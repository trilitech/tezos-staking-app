import '@/theme/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { ConnectionProvider } from '@/providers/ConnectionProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OperationResponseProvider } from '@/providers/OperationResponseProvider'
import theme from '@/theme/chakra-theme'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OperationResponseProvider>
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </ConnectionProvider>
      </QueryClientProvider>
    </OperationResponseProvider>
  )
}

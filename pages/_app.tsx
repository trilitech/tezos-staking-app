import '@/theme/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from '@/components/ui/provider'
import { ConnectionProvider } from '@/providers/ConnectionProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OperationResponseProvider } from '@/providers/OperationResponseProvider'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OperationResponseProvider>
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider>
          <Provider>
            <Component {...pageProps} />
          </Provider>
        </ConnectionProvider>
      </QueryClientProvider>
    </OperationResponseProvider>
  )
}

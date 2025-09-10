import '@/theme/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from '@/components/ui/provider'
import { ConnectionProvider } from '@/providers/ConnectionProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OperationResponseProvider } from '@/providers/OperationResponseProvider'
import { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      defaults: '2025-05-24',
      loaded: posthog => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      }
    })
  }, [])

  return (
    <PostHogProvider client={posthog}>
      <OperationResponseProvider>
        <QueryClientProvider client={queryClient}>
          <ConnectionProvider>
            <Provider>
              <Component {...pageProps} />
            </Provider>
          </ConnectionProvider>
        </QueryClientProvider>
      </OperationResponseProvider>
    </PostHogProvider>
  )
}

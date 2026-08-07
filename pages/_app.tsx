import '@/theme/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from '@/components/ui/provider'
import { ConnectionProvider } from '@/providers/ConnectionProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OperationResponseProvider } from '@/providers/OperationResponseProvider'
import { BeaconDebugPanel } from '@/components/BeaconDebugPanel'
import { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // The Beacon Matrix (P2P) transport rejects its in-flight sync with a
    // benign "Syncing stopped manually" error whenever the client is torn down
    // (e.g. on a disconnect/reload). Nothing awaits it, so it would otherwise
    // surface as an unhandled rejection / dev error overlay. Swallow only that
    // exact message; everything else propagates normally.
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason: any = event.reason
      const message = String(reason?.message ?? reason ?? '')
      if (message.includes('Syncing stopped manually')) {
        event.preventDefault()
      }
    }
    window.addEventListener('unhandledrejection', onRejection)
    return () => window.removeEventListener('unhandledrejection', onRejection)
  }, [])

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
              <BeaconDebugPanel />
            </Provider>
          </ConnectionProvider>
        </QueryClientProvider>
      </OperationResponseProvider>
    </PostHogProvider>
  )
}

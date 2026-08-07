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
    // Beacon spins up several wallet transports at once, and the ones the user
    // does not pick emit benign background rejections that nothing awaits — so
    // they surface as unhandled rejections / dev error overlays even though the
    // real connection is fine:
    //  - "Syncing stopped manually": Matrix (P2P) transport torn down.
    //  - "Proposal expired" / "Pairing expired": WalletConnect proposal/pairing
    //    TTL elapses (~5 min) when the WC QR option is left unused.
    // Swallow only this known-benign set; every other rejection propagates.
    const BENIGN_WALLET_REJECTIONS = [
      'Syncing stopped manually',
      'Proposal expired',
      'Pairing expired'
    ]
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason: any = event.reason
      const message = String(reason?.message ?? reason ?? '')
      if (BENIGN_WALLET_REJECTIONS.some(m => message.includes(m))) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    }
    // Capture phase so we run before Next's dev-overlay listener where possible.
    window.addEventListener('unhandledrejection', onRejection, true)
    return () =>
      window.removeEventListener('unhandledrejection', onRejection, true)
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

import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  return (
    <Html lang='en' suppressHydrationWarning>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        {/* Twitter Card metadata */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@tezos' />
        <meta
          name='twitter:title'
          content='Earn rewards for contributing to network security'
        />
        <meta
          name='twitter:description'
          content="Stake your tez to earn greater rewards for participating in Tezos' proof-of-stake mechanism."
        />
        <meta
          name='twitter:image'
          content={`${siteUrl}/images/stake.tezos.com-twitter-card.webp`}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

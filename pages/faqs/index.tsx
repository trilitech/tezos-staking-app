'use client'

import { Center } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useConnection } from '@/providers/ConnectionProvider'
import Head from 'next/head'
import { CookieBanner } from '@/components/CookieBanner'
import Footer from '@/components/Footer'
import Faqs from '@/components/Faqs'
import { useRouter } from 'next/router'

export interface DelegateData {
  address: string
  balance: number
  spendableBalance: number
  stakedBalance: number
  unstakedBalance: number
}

async function fetchDelegateData(address: string) {
  const apiAddress =
    (process.env.NEXT_PUBLIC_TZKT_API_URL as string) + '/v1/accounts/' + address
  const response = await fetch(apiAddress)
  return response.json()
}

const metaDescription = 'Tezos Staking App - Delegate and stake with ease.'

export default function Home() {
  const { isConnected } = useConnection()
  const router = useRouter()

  useEffect(() => {
    if (isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  return (
    <>
      <Head>
        <title>Staking Tezos | Tezos</title>
        <meta key='og.site_name' property='og:site_name' content='Tezos' />
        <meta name='description' content={metaDescription} />
        <meta property='og:description' content={metaDescription} />
        <meta property='twitter:description' content={metaDescription} />
        <meta property='og:image' content='' />
        <meta property='twitter:image' content='' />
      </Head>
      <Center
        px='24px'
        minH='100vh'
        mx='auto'
        flexDir='column'
        justifyContent='start'
        bg='linear-gradient(90deg, #6C235E 0%, #5C72FA 100%)'
        overflow='hidden'
        pos='relative'
      >
        <Faqs />
        <Footer />
      </Center>

      <CookieBanner />
    </>
  )
}

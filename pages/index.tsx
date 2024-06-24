'use client'
import { Center, Spinner, Flex } from '@chakra-ui/react'
import { LoginModal } from '../components/LoginModal'
import { useState, useEffect } from 'react'
import { useConnection } from '@/providers/ConnectionProvider'
import { TermAndPolicy } from '../components/TermAndPolicy'
import { AccountBanner } from '@/components/AccountBanner'
import { MobileAccountBanner } from '@/components/MobileAccountBanner'
import { AccountBody } from '@/components/AccountBody'
import { ErrorModal } from '@/components/ErrorModal'
import { useQuery } from '@tanstack/react-query'
import { mutezToTez } from '@/utils/mutezToTez'
import Head from 'next/head'
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
  const { isConnected, address } = useConnection()

  const [delegateData, setDelegateData] = useState<DelegateData | null>(null)

  const { data, error } = useQuery({
    queryKey: ['accountInfoData'],
    queryFn: async () => {
      if (isConnected && !!address) {
        const data = await fetchDelegateData(address)
        return data
      }
      return null
    },
    refetchInterval: 10000,
    refetchIntervalInBackground: true
  })

  useEffect(() => {
    if (!!data) {
      const formatData = {
        ...data,
        spendableBalance: mutezToTez(
          data.balance - data.stakedBalance - data.unstakedBalance
        ),
        stakedBalance: mutezToTez(data.stakedBalance),
        unstakedBalance: mutezToTez(data.unstakedBalance)
      }

      setDelegateData(formatData)
    }
  }, [isConnected, address, data])

  return (
    <>
      <Head>
        <title>Staking App | Tezos</title>
        <meta key='og.site_name' property='og:site_name' content='Tezos' />
        <meta name='description' content={metaDescription} />
        <meta property='og:description' content={metaDescription} />
        <meta property='twitter:description' content={metaDescription} />
        <meta property='og:image' content='' />
        <meta property='twitter:image' content='' />
      </Head>
      <Center
        py='20px'
        minH='100vh'
        bg='#cbd5e0'
        bgImage={!isConnected ? '/images/login-bg.webp' : '/images/bg-grey.png'}
        backgroundPosition='center'
        backgroundRepeat='no-repeat'
        backgroundSize='cover'
      >
        {isConnected === undefined ? (
          <Spinner />
        ) : isConnected ? (
          <>
            {error && (
              <ErrorModal
                onClick={() => window.location.reload()}
                btnText='Refresh'
              />
            )}
            <Flex flexDir='column' w='600px' gap='10px' mx='20px'>
              <AccountBanner
                name='Your Wallet'
                address={delegateData?.address ?? ''}
                display={['none', null, 'flex']}
              />
              <MobileAccountBanner
                name='Your Wallet'
                address={delegateData?.address ?? ''}
                display={['flex', null, 'none']}
              />
              <AccountBody {...(delegateData as DelegateData)} />
              <TermAndPolicy pt='10px' />
            </Flex>
          </>
        ) : (
          <Flex
            flexDir='column'
            justify='center'
            alignItems='center'
            alignSelf='center'
            px='20px'
          >
            <LoginModal />
            <TermAndPolicy pt='30px' />
          </Flex>
        )}
      </Center>
    </>
  )
}

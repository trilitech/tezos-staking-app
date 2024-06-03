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
export interface DelegateData {
  address: string
  balance: number
  spendableBalance: number
  stakedBalance: number
  unstakedBalance: number
}

async function fetchDelegateData(address: string) {
  const apiAddress = (process.env.NEXT_PUBLIC_API_URL as string) + address
  const response = await fetch(apiAddress)
  return response.json()
}

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
    <Center
      h={[`${isConnected ? '100%' : '100vh'}`, '100vh']}
      py='20px'
      bg='#cbd5e0'
      bgImage={!isConnected ? '/images/login-bg.png' : ''}
    >
      {isConnected === undefined ? (
        <Spinner />
      ) : isConnected ? (
        <>
          {error ? (
            <ErrorModal
              onClick={() => window.location.reload()}
              btnText='Refresh'
            />
          ) : undefined}
          <Flex flexDir='column' w='600px' gap='15px' mx='20px'>
            <AccountBanner
              name='Account Name'
              address={delegateData?.address ?? ''}
              display={['none', null, 'flex']}
            />
            <MobileAccountBanner
              name='Account Name'
              address={delegateData?.address ?? ''}
              display={['flex', null, 'none']}
            />
            <AccountBody {...(delegateData as DelegateData)} />
            <TermAndPolicy color='#718096' />
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
          <TermAndPolicy color='white' mt='20px' />
        </Flex>
      )}
    </Center>
  )
}

'use client'
import { Center, Spinner, Flex } from '@chakra-ui/react'
import { LoginModal } from '../components/LoginModal'
import { useState, useEffect } from 'react'
import { useConnection } from '@/components/ConnectionProvider'
import { TermAndPolicy } from '../components/TermAndPolicy'
import { AccountBanner } from '@/components/AccountBanner'
import { MobileAccountBanner } from '@/components/MobileAccountBanner'
import { AccountBody } from '@/components/AccountBody'
import { ErrorModal } from '@/components/ErrorModal'

export interface DelegateData {
  address: string
  balance: number
  stakedBalance: number
  unstakedBalance: number
  frozenDeposit: number
}

export default function Home() {
  const { isConnected, address } = useConnection()

  const [data, setData] = useState<DelegateData | null>(null)
  const [error, setError] = useState(false)

  const fetchData = async (address: string | undefined) => {
    const apiAddress = (process.env.NEXT_PUBLIC_API_URL as string) + address

    if (error) setError(false)

    try {
      const response = await fetch(apiAddress)
      const data: DelegateData = await response.json()
      setData(data)
    } catch (error) {
      setError(true)
      console.error(
        'Error fetching data from Tzkt API. Check api/address is correct.',
        error
      )
    }
  }

  useEffect(() => {
    if (isConnected) fetchData(address)
  }, [isConnected, address])

  return (
    <Center
      h='100vh'
      bg='#cbd5e0'
      bgImage={!isConnected ? '/images/login-bg.png' : ''}
      pt='20px'
    >
      {isConnected === undefined ? (
        <Spinner />
      ) : isConnected ? (
        <>
          {error ? <ErrorModal /> : undefined}
          <Flex flexDir='column' w='600px' gap='15px' mx='20px'>
            <AccountBanner
              name='Account Name'
              address={data?.address ?? ''}
              display={['none', null, 'flex']}
            />
            <MobileAccountBanner
              name='Account Name'
              address={data?.address ?? ''}
              display={['flex', null, 'none']}
            />
            <AccountBody
              {...(data as DelegateData)}
              delegationStatus='inactive'
            />
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

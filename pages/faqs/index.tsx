import { Center } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useConnection } from '@/providers/ConnectionProvider'
import { useQuery } from '@tanstack/react-query'
import { mutezToTez } from '@/utils/mutezToTez'
import Head from 'next/head'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { getBakerList } from '@/components/operationModals/Delegate'
import { shuffleBakerList } from '@/components/operationModals/Delegate/ChooseBaker'
import { CookieBanner } from '@/components/CookieBanner'
import Footer from '@/components/Footer'
import Faqs from '@/components/Faqs'

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
  const [bakerList, setBakerList] = useState<BakerInfo[] | null>(null)

  const bakerListQueryData = useQuery({
    queryKey: ['bakerList'],
    queryFn: getBakerList,
    staleTime: 180000
  })

  useEffect(() => {
    if (bakerListQueryData.status === 'success') {
      let bakerData = bakerListQueryData.data?.map((baker: BakerInfo) => {
        return {
          alias: baker.alias ?? 'Private Baker',
          address: baker.address,
          acceptsStaking: mutezToTez(baker.limitOfStakingOverBaking) > 0,
          stakingFees: baker.edgeOfBakingOverStaking / 10000000,
          stakingFreeSpace: mutezToTez(
            baker.stakedBalance * mutezToTez(baker.limitOfStakingOverBaking) -
              baker.externalStakedBalance
          ),
          totalStakedBalance: baker.totalStakedBalance
        }
      })
      bakerData = shuffleBakerList(bakerData)
      setBakerList(bakerData)
    } else if (bakerListQueryData.status === 'error') {
      console.error('Fail to get the baker list')
    }
  }, [bakerListQueryData.status])

  const { data, error } = useQuery({
    queryKey: ['accountInfoData'],
    queryFn: async () => {
      if (isConnected && !!address) {
        return await fetchDelegateData(address)
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

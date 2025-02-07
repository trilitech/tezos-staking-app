import { Box, Center, Flex, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useConnection } from '@/providers/ConnectionProvider'
import { useQuery } from '@tanstack/react-query'
import { mutezToTez } from '@/utils/mutezToTez'
import Head from 'next/head'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { getBakerList } from '@/components/operationModals/Delegate'
import { shuffleBakerList } from '@/components/operationModals/Delegate/ChooseBaker'
import { CookieBanner } from '@/components/CookieBanner'
import Hero from '@/components/Hero'
import StakeOptions from '@/components/StakeOptions'
import FooterCta from '@/components/FooterCta'
import DashboardInfo from '@/components/DashboardInfo'
import Footer from '@/components/Footer'
import { TermAndPolicy } from '@/components/TermAndPolicy'
import { AccountBanner } from '@/components/AccountBanner'
import { MobileAccountBanner } from '@/components/MobileAccountBanner'
import { AccountBody } from '@/components/AccountBody'
import { ErrorModal } from '@/components/ErrorModal'

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
      {isConnected === undefined ? (
        <Spinner />
      ) : isConnected ? (
        <Center
          py='20px'
          minH='100vh'
          bg='#cbd5e0'
          bgImage='/images/bg-blue.png'
          backgroundPosition='center'
          backgroundRepeat='no-repeat'
          backgroundSize='cover'
        >
          {(error || bakerListQueryData.status === 'error') && (
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
            <AccountBody
              delegateData={delegateData as DelegateData}
              bakerList={bakerList as BakerInfo[]}
            />
            <TermAndPolicy pt='10px' />
          </Flex>
        </Center>
      ) : (
        <Center
          minH='100vh'
          maxW='100%'
          mx='auto'
          flexDir='column'
          justifyContent='start'
          overflow='hidden'
          pos='relative'
          backgroundSize='contain'
          backgroundBlendMode='multiply'
        >
          <Box
            position='absolute'
            bottom='0'
            left='0'
            right='0'
            height='400px'
            bgImage="url('/images/Gradient.png')"
            bgSize='cover'
            bgRepeat='no-repeat'
            zIndex='0'
          />
          <Box
            display={['none', null, 'block']}
            position='absolute'
            bottom='155vh'
            w='38px'
            height='240px'
            left='12%'
            bgImage="url('/images/granular-pattern1.svg')"
            bgSize='cover'
            bgRepeat='no-repeat'
            zIndex='1'
          />
          <Box
            position='absolute'
            bottom={['155vh', '145vh']}
            w={['25px', '28px', '38px']}
            height={['160px', '210px', '242px']}
            right='15%'
            bgImage="url('/images/granular-pattern2.svg')"
            bgSize='cover'
            bgRepeat='no-repeat'
            zIndex='1'
          />
          <Box
            position='absolute'
            bottom='300px'
            w='700px'
            height='700px'
            left='-500px'
            bg='radial-gradient(96.32% 48.16% at 50% 50%, rgba(92, 114, 250, 0.40) 0%, rgba(240, 240, 255, 0.00) 100%)'
            filter='blur(37px)'
            bgRepeat='no-repeat'
            zIndex='0'
          />
          <Box
            position='absolute'
            bottom='80vh'
            w='700px'
            height='700px'
            right='-500px'
            bg='radial-gradient(96.32% 48.16% at 50% 50%, rgba(92, 114, 250, 0.40) 0%, rgba(240, 240, 255, 0.00) 100%)'
            filter='blur(37px)'
            bgRepeat='no-repeat'
            zIndex='1'
          />
          <Hero />
          <StakeOptions />
          <DashboardInfo />
          <FooterCta />
          <Footer />
        </Center>
      )}

      <CookieBanner />
    </>
  )
}

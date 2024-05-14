'use client'
import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Center,
  Box,
  IconButton,
  Spinner
} from '@chakra-ui/react'

import { RepeatIcon } from '@chakra-ui/icons'

import { useState, useEffect } from 'react'
import { useConnection } from '@/components/ConnectionProvider'
import { ConnectButton } from '@/components/ConnectButton'
import { DisconnectButton } from '@/components/DisconnectButton'
import { StakeButton } from '@/components/StakeButton'
import { UnstakeButton } from '@/components/UnstakeButton'
import { DelegateButton } from '@/components/DelegateButton'
import { FinalizeUnstakeButton } from '@/components/FinalizeUnstakeButton'
import { OperationResult } from '@/components/Operations/types'

interface AddressInputProps {
  address: string
  setAddress: (address: string) => void
}

interface DelegateData {
  address: string
  balance: number
  stakedBalance: number
  unstakedBalance: number
  frozenDeposit: number
}

export default function Home() {
  const { isConnected, address, Tezos } = useConnection()

  const apiUrl = String('https://api.parisnet.tzkt.io/v1/accounts/')
  const [data, setData] = useState<DelegateData | null>(null)
  const [opResult, setOpResult] = useState<OperationResult | null>(null)

  const fetchData = async (address: string | undefined) => {
    const apiAddress = String(apiUrl + address)
    try {
      const response = await fetch(apiAddress)
      const data = await response.json()
      setData(data)
    } catch (error) {
      window.alert(
        `Error fetching data from Tzkt API. Check api/address is correct. \nURL:${apiAddress}.\nError: ${error}`
      )
    }
  }

  useEffect(() => {
    if (isConnected) {
      fetchData(address)
    }
  }, [isConnected, address])

  return (
    <Box>
      {isConnected === undefined ? (
        <Spinner />
      ) : isConnected ? (
        <>
          <DisconnectButton />
          <Center>
            <TableContainer maxW='80%'>
              <Table variant='simple'>
                <TableCaption>Staking Information</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Property</Th>
                    <Th>Value</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Address</Td>
                    <Td>{data?.address}</Td>
                  </Tr>
                  <Tr>
                    <Td>Balance</Td>
                    <Td>{data?.balance}</Td>
                  </Tr>
                  <Tr>
                    <Td>StakedBalance</Td>
                    <Td>{data?.stakedBalance}</Td>
                  </Tr>
                  <Tr>
                    <Td>UnstakedBalance</Td>
                    <Td>{data?.unstakedBalance}</Td>
                  </Tr>
                  <Tr>
                    <Td>FrozenDeposit</Td>
                    <Td>{data?.frozenDeposit}</Td>
                  </Tr>
                </Tbody>
              </Table>
              <IconButton
                aria-label='Refresh'
                icon={<RepeatIcon />}
                onClick={() => fetchData(address)}
              />
            </TableContainer>
            {/* Mark DelegateButton grey if already delegated*/}
            <DelegateButton
              delegateId={'tz3Q67aMz7gSMiQRcW729sXSfuMtkyAHYfqc'}
              Tezos={Tezos}
              setOpResult={setOpResult}
            />
            {/* Mark StakeButton grey if available balance is 0.*/}
            <StakeButton setOpResult={setOpResult} amount={100} Tezos={Tezos} />
            {/* Mark Unstake button grey if stakedbalance is 0.*/}
            <UnstakeButton
              amount={100}
              Tezos={Tezos}
              setOpResult={setOpResult}
            />
            {/* Mark Finalize Unstake button grey if unstaked - finalized funds are none. */}
            <FinalizeUnstakeButton Tezos={Tezos} setOpResult={setOpResult} />
          </Center>
        </>
      ) : (
        <ConnectButton />
      )}
    </Box>
  )
}

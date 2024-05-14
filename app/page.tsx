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
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Flex,
  IconButton,
  Text,
  Spinner
} from '@chakra-ui/react'

import { RepeatIcon } from '@chakra-ui/icons'

import { useState, useEffect } from 'react'
import { useConnection } from '@/components/ConnectionProvider'
import { ConnectButton } from '@/components/ConnectButton'
import { DisconnectButton } from '@/components/DisconnectButton'

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
  const { isConnected, address } = useConnection()

  const apiUrl = String('https://api.parisnet.tzkt.io/v1/accounts/')
  const [data, setData] = useState<DelegateData | null>(null)

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
          </Center>
        </>
      ) : (
        <ConnectButton />
      )}
    </Box>
  )
}

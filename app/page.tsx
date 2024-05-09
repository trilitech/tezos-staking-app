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
  IconButton
} from '@chakra-ui/react'

import { RepeatIcon } from '@chakra-ui/icons'

import { useState, useEffect } from 'react'

interface AddressInputProps {
  address: string
  setAddress: (address: string) => void
}

const AddressInput: React.FC<AddressInputProps> = ({ address, setAddress }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value)
  }
  return (
    <Input
      value={address}
      onChange={handleInputChange}
      placeholder='Enter address'
      title={'Enter the address you want to check'}
    />
  )
}

function BasicUsage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button position='absolute' top='0' left='0' m={5} onClick={onOpen}>
        Open Modal
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Hello World</ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default function Home() {
  // Define your variables
  const [address, setAddress] = useState('tz1M6txwzVsUU9DCd2odaHnsc38spSHycX5r')

  const [data, setData] = useState(null)

  const fetchData = () => {
    fetch(`https://api.parisnet.tzkt.io/v1/accounts/${address}`)
      .then(response => response.json())
      .then(data => setData(data))
  }

  useEffect(() => {
    if (address) {
      fetchData()
    }
  }, [address])

  return (
    <Box>
      <Flex direction='column' position='absolute' left='5%' top='50%'>
        <AddressInput address={address} setAddress={setAddress} />
      </Flex>
      <BasicUsage />
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
            onClick={fetchData}
          />
        </TableContainer>
      </Center>
    </Box>
  )
}

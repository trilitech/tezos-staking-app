import React, { useState } from 'react'
import {
  Button,
  Flex,
  Text,
  InputGroup,
  Input,
  InputRightElement,
  InputLeftElement,
  Link as ChakraLink,
  Image
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { BakerListDropDown } from './BakerListDropDown'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { CloseIcon } from '@chakra-ui/icons'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'

interface ChooseBakerProps {
  spendableBalance: number
  handleOneStepForward: () => void
  selectedBaker: BakerInfo | null
  setSelectedBaker: (b: BakerInfo | null) => void
  bakerList: BakerInfo[]
}

export const ChooseBaker = ({
  spendableBalance,
  handleOneStepForward,
  selectedBaker,
  setSelectedBaker,
  bakerList
}: ChooseBakerProps) => {
  const [value, setValue] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const handleChange = (event: any) => {
    const val = event.target.value
    setValue(val)
    findBaker(val)
  }

  const findBaker = (address: string): void => {
    if (!bakerList) return
    const baker = bakerList.find(baker => baker.address === address)

    if (baker) setSelectedBaker(baker)
    else setSelectedBaker(null)
  }

  if (isDropdownOpen) {
    return (
      <BakerListDropDown
        setSelectedBaker={setSelectedBaker}
        setIsDropdownOpen={setIsDropdownOpen}
        bakerList={bakerList}
      />
    )
  }

  return (
    <Flex flexDir='column' justify='center'>
      <Header py='24px'>Delegate</Header>
      <ColumnHeader pb='12px'>AVAILABLE</ColumnHeader>
      <BalanceBox balance={spendableBalance} />
      <Flex alignItems='center' justify='space-between' mb='12px'>
        <ColumnHeader>SELECT BAKER</ColumnHeader>
        <ChakraLink
          as={Link}
          href={`${process.env.NEXT_PUBLIC_TZKT_UI_URL}/bakers`}
          target='_blank'
          display='flex'
          alignItems='center'
          gap='5px'
          _hover={{
            cursor: 'pointer'
          }}
        >
          <Text fontSize='14px'>View bakers</Text>
          <ExternalLinkIcon />
        </ChakraLink>
      </Flex>
      <InputGroup size='md' mb='30px'>
        {!!selectedBaker && (
          <InputLeftElement>
            <Image
              w='30px'
              h='30px'
              src={`${process.env.NEXT_PUBLIC_TZKT_AVATARS_URL}/${selectedBaker.address}`}
              alt='baker avatar'
            />
          </InputLeftElement>
        )}

        <Input
          onChange={handleChange}
          pr='4.5rem'
          placeholder='Paste tz address'
          value={selectedBaker ? selectedBaker.address : value}
        />

        <InputRightElement width='4.5rem' pr='12px'>
          {selectedBaker ? (
            <CloseIcon
              _hover={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedBaker(null)
                setValue('')
              }}
              fontSize='12px'
            />
          ) : (
            <Button
              borderRadius='8px'
              bg='black'
              color='white'
              h='1.75rem'
              size='sm'
              _hover={{ bg: 'black' }}
              onClick={() => setIsDropdownOpen(true)}
            >
              Select
            </Button>
          )}
        </InputRightElement>
      </InputGroup>
      <PrimaryButton disabled={!selectedBaker} onClick={handleOneStepForward}>
        Preview
      </PrimaryButton>
    </Flex>
  )
}

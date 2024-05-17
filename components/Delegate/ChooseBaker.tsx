import React, { useState } from 'react'
import {
  Button,
  Image,
  Flex,
  Text,
  InputGroup,
  Input,
  InputRightElement,
  Link as ChakraLink
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { PrimaryButton } from '../buttons/PrimaryButton'
import { BakerListDropDown } from './BakerListDropDown'
import { BakerInfo } from '../Operations/tezInterfaces'
import { CloseIcon } from '@chakra-ui/icons'

export const ChooseBaker = ({
  availableBalance,
  handleOneStepForward,
  selectedBaker,
  setSelectedBaker,
  bakerList
}: {
  availableBalance: number
  handleOneStepForward: () => void
  selectedBaker: BakerInfo | null
  setSelectedBaker: (b: BakerInfo | null) => void
  bakerList: BakerInfo[]
}) => {
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
      <Text textAlign='center' fontSize='24px' py='24px' fontWeight={600}>
        Delegate
      </Text>
      <Text color='#4A5568' fontSize='14px' pb='12px'>
        AVAILABLE
      </Text>
      <Flex
        justify='space-between'
        alignItems='center'
        borderRadius='8px'
        w='100%'
        py='12px'
        px='16px'
        bg='#EDF2F7'
        mb='30px'
      >
        <Text>{availableBalance}</Text>
        <Image src='/images/xtz-icon.svg' alt='xtz icon' />
      </Flex>
      <Flex alignItems='center' justify='space-between' mb='12px'>
        <Text color='#4A5568' fontSize='14px'>
          SELECT BAKER
        </Text>
        <ChakraLink
          as={Link}
          href='https://parisnet.tzkt.io/bakers'
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

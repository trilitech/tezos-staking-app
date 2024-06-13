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
  Image,
  Icon
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { BakerListDropDown } from './BakerListDropDown'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { CloseIcon } from '@chakra-ui/icons'
import { Header, ColumnHeader } from '@/components/modalBody'

interface ChooseBakerProps {
  handleOneStepForward: () => void
  selectedBaker: BakerInfo | null
  setSelectedBaker: (b: BakerInfo | null) => void
  bakerList: BakerInfo[]
  setShowStepper: (arg: boolean) => void
}

export const ChooseBaker = ({
  handleOneStepForward,
  selectedBaker,
  setSelectedBaker,
  bakerList,
  setShowStepper
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
        setShowStepper={setShowStepper}
      />
    )
  }

  return (
    <Flex flexDir='column' justify='center'>
      <Header pb='24px'>Delegate</Header>
      <Flex alignItems='center' justify='space-between' mb='12px'>
        <ColumnHeader>SELECT BAKER</ColumnHeader>
        <ChakraLink
          as={Link}
          href={`${process.env.NEXT_PUBLIC_TZKT_UI_URL}/bakers`}
          target='_blank'
          display='flex'
          alignItems='center'
          gap='4px'
          _hover={{
            cursor: 'pointer'
          }}
        >
          <Text fontSize='14px' fontWeight={600} color='#2D3748'>
            View bakers
          </Text>
          <Image src='/images/external.svg' alt='external icon' />
        </ChakraLink>
      </Flex>
      <InputGroup size='md' mb='30px'>
        {!!selectedBaker && (
          <InputLeftElement h='100%'>
            <Image
              ml='5px'
              w='30px'
              h='30px'
              objectFit='cover'
              src={`${process.env.NEXT_PUBLIC_TZKT_AVATARS_URL}/${selectedBaker.address}`}
              alt='baker avatar'
            />
          </InputLeftElement>
        )}

        <Input
          onChange={handleChange}
          pr='4.5rem'
          placeholder='Paste tz address'
          sx={{
            '::placeholder': {
              fontSize: '16px'
            }
          }}
          value={selectedBaker ? selectedBaker.address : value}
          h='58px'
          overflowX='auto'
        />

        <InputRightElement mr='12px' h='100%' w='75px'>
          {selectedBaker ? (
            <Icon
              as={CloseIcon}
              _hover={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedBaker(null)
                setValue('')
              }}
              w='14px'
              h='14px'
              transform='translateX(20px)'
            />
          ) : (
            <Button
              h='34px'
              px='12px'
              py='6px'
              borderRadius='8px'
              fontWeight={600}
              fontSize='16px'
              bg='black'
              color='white'
              _hover={{ bg: 'black' }}
              onClick={() => {
                setIsDropdownOpen(true)
                setShowStepper(false)
              }}
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

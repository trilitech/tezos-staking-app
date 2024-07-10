import React, { useState } from 'react'
import {
  Flex,
  InputGroup,
  Input,
  InputRightElement,
  InputLeftElement,
  Image
} from '@chakra-ui/react'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { Header } from '@/components/modalBody'
import { SearchIcon } from '@/components/icons'
import { BakerBoxList } from './BakerBoxList'

interface ChooseBakerProps {
  handleOneStepForward: () => void
  selectedBaker: BakerInfo | null
  setSelectedBaker: (b: BakerInfo | null) => void
  bakerList: BakerInfo[]
}
export function shuffleBakerList(bakerList: BakerInfo[]) {
  for (let i = bakerList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[bakerList[i], bakerList[j]] = [bakerList[j], bakerList[i]]
  }
  return bakerList
}

export const ChooseBaker = ({
  handleOneStepForward,
  selectedBaker,
  setSelectedBaker,
  bakerList
}: ChooseBakerProps) => {
  const [searchText, setSearchText] = useState('')
  const [bakersShown, setBakersShown] = useState<BakerInfo[]>(
    bakerList.filter(baker => baker.acceptsStaking)
  )

  const handleChange = (event: any) => {
    const val = event.target.value
    setSearchText(val)
    findBaker(val)
  }

  const findBaker = (text: string): void => {
    if (!bakerList) return

    const filteredBaker = bakerList.filter(
      baker =>
        baker.address === text ||
        baker.alias.toLowerCase() === text.toLowerCase()
    )

    if (filteredBaker.length === 1) {
      setSelectedBaker(filteredBaker[0])
      handleOneStepForward()
    } else if (filteredBaker.length > 1)
      setBakersShown(filteredBaker.filter(baker => baker.acceptsStaking))
    else {
      setBakersShown(bakerList.filter(baker => baker.acceptsStaking))
      setSelectedBaker(null)
    }
  }

  return (
    <Flex flexDir='column' justify='center'>
      <Header pb='24px'>{!!selectedBaker ? 'Delegate' : 'Select Baker'}</Header>
      <InputGroup size='md' mb='30px'>
        {!!selectedBaker && (
          <InputLeftElement h='100%'>
            <Image
              ml='6px'
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
          placeholder='Search by Name or Paste tz address'
          sx={{
            '::placeholder': {
              fontSize: '16px'
            }
          }}
          value={
            selectedBaker
              ? selectedBaker.alias
                ? selectedBaker.alias
                : 'Private Baker'
              : searchText
          }
          h='58px'
          overflowX='auto'
        />

        <InputRightElement h='100%'>
          <SearchIcon />
        </InputRightElement>
      </InputGroup>

      {!selectedBaker && (
        <BakerBoxList
          bakerList={bakersShown}
          setSelectedBaker={setSelectedBaker}
          handleOneStepForward={handleOneStepForward}
        />
      )}
    </Flex>
  )
}

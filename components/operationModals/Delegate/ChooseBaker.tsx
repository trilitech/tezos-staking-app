import React, { useState } from 'react'
import { Flex, InputGroup, Input, InputRightElement } from '@chakra-ui/react'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { Header } from '@/components/modalBody'
import { SearchIcon } from '@/components/icons'
import { BakerBoxList } from './BakerBoxList'

interface ChooseBakerProps {
  handleOneStepForward: () => void
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
      <Header pb='24px'>Select Baker</Header>
      <InputGroup size='md' mb='30px'>
        <Input
          onChange={handleChange}
          pr='4.5rem'
          placeholder='Search by Name or Paste tz address'
          sx={{
            '::placeholder': {
              fontSize: '16px'
            }
          }}
          value={searchText}
          h='58px'
          overflowX='auto'
        />

        <InputRightElement h='100%'>
          <SearchIcon />
        </InputRightElement>
      </InputGroup>

      <BakerBoxList
        bakerList={bakersShown}
        setSelectedBaker={setSelectedBaker}
        handleOneStepForward={handleOneStepForward}
      />
    </Flex>
  )
}

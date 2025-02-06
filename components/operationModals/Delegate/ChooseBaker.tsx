import React, { useState } from 'react'
import {
  Flex,
  InputGroup,
  Input,
  InputRightElement,
  Text
} from '@chakra-ui/react'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { Header } from '@/components/modalBody'
import { SearchIcon } from '@/components/icons'
import { BakerBoxList } from './BakerBoxList'
import { DescIcon } from '@/components/icons/DescIcon'
import { AscIcon } from '@/components/icons/AscIcon'

interface ChooseBakerProps {
  handleOneStepForward: () => void
  setSelectedBaker: (b: BakerInfo | null) => void
  bakerList: BakerInfo[]
}
export function shuffleBakerList(bakerList: BakerInfo[]) {
  for (let i = bakerList?.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[bakerList[i], bakerList[j]] = [bakerList[j], bakerList[i]]
  }
  return bakerList
}

type Order = 'asc' | 'desc'
type SortedBy = 'staking' | 'fee' | 'freeSpace'
type SortOrder = {
  staking: null | Order
  fee: null | Order
  freeSpace: null | Order
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
  const [sortOrder, setSortOrder] = useState<SortOrder>({
    staking: null,
    fee: null,
    freeSpace: null
  })

  const sortBy = (order: Order, sortedBy: SortedBy) => {
    switch (sortedBy) {
      case 'staking':
        const sortedByStaking = [...bakersShown].sort((a, b) =>
          order === 'asc'
            ? a.totalStakedBalance - b.totalStakedBalance
            : b.totalStakedBalance - a.totalStakedBalance
        )
        setBakersShown(sortedByStaking)
        return
      case 'fee':
        const sortedByFee = [...bakersShown].sort((a, b) =>
          order === 'asc'
            ? a.stakingFees - b.stakingFees
            : b.stakingFees - a.stakingFees
        )
        setBakersShown(sortedByFee)
        return
      case 'freeSpace':
        const sortedByFreeSpace = [...bakersShown].sort((a, b) =>
          order === 'asc'
            ? a.stakingFreeSpace - b.stakingFreeSpace
            : b.stakingFreeSpace - a.stakingFreeSpace
        )
        setBakersShown(sortedByFreeSpace)
        return
      default:
        break
    }
  }

  const handleSort = (key: SortedBy) => {
    let order: Order = key === 'fee' ? 'asc' : 'desc'

    if (sortOrder[key] === 'desc') order = 'asc'
    else if (sortOrder[key] === 'asc') order = 'desc'

    // Reset the sort order for other keys
    const newSortOrder: SortOrder = {
      staking: null,
      fee: null,
      freeSpace: null
    }
    newSortOrder[key] = order
    setSortOrder(newSortOrder)

    if (key === 'staking') sortBy(order, 'staking')
    else if (key === 'fee') sortBy(order, 'fee')
    else sortBy(order, 'freeSpace')
  }

  const handleChange = (event: any) => {
    const val = event.target.value
    setSearchText(val)
    findBaker(val)
  }

  const findBaker = (query: string): void => {
    if (!bakerList) return
    setSortOrder({
      staking: null,
      fee: null,
      freeSpace: null
    })

    const filteredBaker = bakerList
      .filter(
        baker =>
          baker.address === query ||
          baker.alias.toLowerCase().includes(query.toLowerCase())
      )
      .filter(baker => baker.acceptsStaking)

    if (filteredBaker.length === 1) {
      setBakersShown(filteredBaker)
    } else if (filteredBaker.length > 1) setBakersShown(filteredBaker)
    else {
      setBakersShown(filteredBaker)
      setSelectedBaker(null)
    }
  }

  return (
    <Flex flexDir='column' justify='center'>
      <Header pb='24px'>Select Baker</Header>
      <InputGroup size='md'>
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

      <Flex
        alignItems='center'
        justify='space-evenly'
        py='24px'
        display={!bakersShown.length ? 'none' : 'flex'}
      >
        <SortText
          onClick={() => handleSort('staking')}
          order={sortOrder['staking']}
        >
          STAKING
        </SortText>
        <Text color='#E2E8F0' display={['none', 'inline-block']}>
          |
        </Text>
        <SortText
          onClick={() => handleSort('freeSpace')}
          order={sortOrder['freeSpace']}
        >
          FREE SPACE
        </SortText>
        <Text color='#E2E8F0' display={['none', 'inline-block']}>
          |
        </Text>
        <SortText onClick={() => handleSort('fee')} order={sortOrder['fee']}>
          FEE
        </SortText>
      </Flex>

      <BakerBoxList
        bakerList={bakersShown}
        setSelectedBaker={setSelectedBaker}
        handleOneStepForward={handleOneStepForward}
      />
    </Flex>
  )
}

const SortText = ({
  children,
  onClick,
  order
}: {
  children: React.ReactNode
  onClick?: () => void
  order: Order | null
}) => {
  const [isHover, setIsHover] = useState(false)
  const getSyle = (order: Order | null) => {
    if (!!order) {
      return {
        color: '#FFFFFF',
        bg: '#4A5568',
        gap: '8px'
      }
    }
    return {}
  }

  return (
    <Flex
      alignItems='center'
      px='10px'
      py='6px'
      onClick={onClick}
      _hover={{ cursor: 'pointer', color: '#2D3748', bg: '#F7FAFC' }}
      borderRadius='8px'
      transition='all 0.3s ease-out'
      sx={getSyle(order)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Text fontSize='14px' fontWeight={600} lineHeight='18px'>
        {children}
      </Text>
      {order === 'desc' ? (
        <DescIcon fill={isHover ? '#A0AEC0' : '#FFFFFF'} />
      ) : order === 'asc' ? (
        <AscIcon fill={isHover ? '#A0AEC0' : '#FFFFFF'} />
      ) : (
        <></>
      )}
    </Flex>
  )
}

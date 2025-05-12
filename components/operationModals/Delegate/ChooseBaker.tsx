import React, { useEffect, useState } from 'react'
import {
  Flex,
  InputGroup,
  Input,
  InputRightElement,
  Text,
  Tooltip,
  Image,
  useDisclosure
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
  currentBakerAddress: string | undefined
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
  bakerList,
  currentBakerAddress
}: ChooseBakerProps) => {
  const [searchText, setSearchText] = useState('')
  const [bakersShown, setBakersShown] = useState<BakerInfo[]>(() => {
    const acceptingBakers = bakerList.filter(baker => baker.acceptsStaking)
    if (!currentBakerAddress) return acceptingBakers

    const currentBaker = acceptingBakers.find(
      b => b.address === currentBakerAddress
    )
    const otherBakers = acceptingBakers.filter(
      b => b.address !== currentBakerAddress
    )

    return currentBaker ? [currentBaker, ...otherBakers] : acceptingBakers
  })
  const [sortOrder, setSortOrder] = useState<SortOrder>({
    staking: null,
    fee: null,
    freeSpace: null
  })

  const sortBy = (order: Order, sortedBy: SortedBy) => {
    switch (sortedBy) {
      case 'staking':
        const sortedByStaking = [...bakersShown].sort((a, b) => {
          if (a.address === currentBakerAddress) return -1
          if (b.address === currentBakerAddress) return 1
          return order === 'asc'
            ? a.totalStakedBalance - b.totalStakedBalance
            : b.totalStakedBalance - a.totalStakedBalance
        })
        setBakersShown(sortedByStaking)
        return
      case 'fee':
        const sortedByFee = [...bakersShown].sort((a, b) => {
          if (a.address === currentBakerAddress) return -1
          if (b.address === currentBakerAddress) return 1
          return order === 'asc'
            ? a.stakingFees - b.stakingFees
            : b.stakingFees - a.stakingFees
        })
        setBakersShown(sortedByFee)
        return
      case 'freeSpace':
        const sortedByFreeSpace = [...bakersShown].sort((a, b) => {
          if (a.address === currentBakerAddress) return -1
          if (b.address === currentBakerAddress) return 1
          return order === 'asc'
            ? a.stakingFreeSpace - b.stakingFreeSpace
            : b.stakingFreeSpace - a.stakingFreeSpace
        })
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

    if (currentBakerAddress) {
      const currentBaker = bakerList.find(
        b => b.address === currentBakerAddress
      )
      if (
        currentBaker &&
        filteredBaker.some(b => b.address === currentBakerAddress)
      ) {
        const otherBakers = filteredBaker.filter(
          b => b.address !== currentBakerAddress
        )
        setBakersShown([currentBaker, ...otherBakers])
      } else {
        setBakersShown(filteredBaker)
      }
    } else {
      setBakersShown(filteredBaker)
    }

    if (filteredBaker.length === 0) {
      setSelectedBaker(null)
    }
  }

  useEffect(() => {
    if (!bakersShown.length) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }, 1)
    }
  }, [bakersShown])

  return (
    <Flex flexDir='column' justify='center'>
      <Header
        display='flex'
        justifyContent='center'
        gap='2'
        alignItems='center'
        pb='24px'
      >
        Select Baker
        <ControlledTooltip label='Bakers on Tezos validate transactions and secure the network.'>
          <Image
            w='16px'
            h='16px'
            src='/images/info-icon-dapp.svg'
            alt='info'
          />
        </ControlledTooltip>
      </Header>
      <InputGroup size='md'>
        <Input
          onChange={handleChange}
          pr='4.5rem'
          placeholder='Search by Name or Paste tz address'
          css={{
            '::placeholder': {
              fontSize: '16px'
            }
          }}
          value={searchText}
          h='48px'
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
        display={'flex'}
      >
        <SortText
          onClick={() => handleSort('staking')}
          order={sortOrder['staking']}
          tooltipLabel='The total amount of tez delegated to or staked with a baker.'
        >
          TOTAL
        </SortText>
        <Text color='gray.200' display={['none', 'inline-block']}>
          |
        </Text>
        <SortText
          tooltipLabel='The amount that the baker takes from staking or delegation rewards.'
          onClick={() => handleSort('fee')}
          order={sortOrder['fee']}
        >
          FEE
        </SortText>

        <Text color='gray.200' display={['none', 'inline-block']}>
          |
        </Text>
        <SortText
          tooltipLabel='The amount of tez that a baker can accept as delegation or stake.'
          onClick={() => handleSort('freeSpace')}
          order={sortOrder['freeSpace']}
        >
          FREE SPACE
        </SortText>
      </Flex>

      <BakerBoxList
        bakerList={bakersShown}
        setSelectedBaker={setSelectedBaker}
        handleOneStepForward={handleOneStepForward}
        currentBakerAddress={currentBakerAddress}
      />
    </Flex>
  )
}

const SortText = ({
  children,
  onClick,
  order,
  tooltipLabel
}: {
  children: React.ReactNode
  onClick?: () => void
  order: Order | null
  tooltipLabel: string
}) => {
  const [isHover, setIsHover] = useState(false)
  const getSyle = (order: Order | null) => {
    if (!!order) {
      return {
        color: '#FFFFFF',
        bg: 'gray.600',
        gap: '8px'
      }
    }
    return {}
  }

  return (
    <Flex gap='1' alignItems='center'>
      <Flex
        alignItems='center'
        px='10px'
        py='6px'
        onClick={onClick}
        _hover={{
          '@media(hover: hover)': {
            cursor: 'pointer',
            color: 'gray.700',
            bg: 'gray.50'
          }
        }}
        borderRadius='8px'
        transition='all 0.3s ease-out'
        css={getSyle(order)}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onTouchStart={() => setIsHover(true)}
        onTouchEnd={() => setIsHover(false)}
      >
        <Text fontSize='14px' fontWeight={600} lineHeight='18px'>
          {children}
        </Text>
        {!order ? (
          <Flex ml='6px'>
            <ControlledTooltip label={tooltipLabel}>
              <Image
                w='18px'
                h='18px'
                src='/images/info-icon-dapp.svg'
                alt='info'
              />
            </ControlledTooltip>
          </Flex>
        ) : order === 'desc' ? (
          <DescIcon fill={isHover ? 'gray.400' : '#FFFFFF'} />
        ) : order === 'asc' ? (
          <AscIcon fill={isHover ? 'gray.400' : '#FFFFFF'} />
        ) : (
          <></>
        )}
      </Flex>
    </Flex>
  )
}

const ControlledTooltip = ({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

  return (
    <Tooltip
      label={label}
      isOpen={isOpen}
      hasArrow
      bg='gray.700'
      borderRadius='4px'
      color='white'
      p='3'
      mx='10px'
    >
      <span onMouseEnter={onOpen} onMouseLeave={onClose} onClick={onToggle}>
        {children}
      </span>
    </Tooltip>
  )
}

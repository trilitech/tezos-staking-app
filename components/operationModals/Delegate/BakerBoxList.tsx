import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { BakerBox } from './BakerBox'
import { BakerInfo } from '@/components/Operations/tezInterfaces'

interface BakerBoxListProps {
  bakerList: BakerInfo[]
  setSelectedBaker: (b: BakerInfo | null) => void
  handleOneStepForward: () => void
  currentBakerAddress: string | undefined
}

export const BakerBoxList = ({
  bakerList,
  setSelectedBaker,
  handleOneStepForward,
  currentBakerAddress
}: BakerBoxListProps) => {
  return (
    <Flex
      flexDir='column'
      overflowY='scroll'
      maxH={['340px', '420px']}
      pb='40px'
      gap='12px'
      sx={{
        '::-webkit-scrollbar': {
          width: '4px'
        },
        '::-webkit-scrollbar-thumb': {
          background: 'gray.200',
          borderRadius: '8px',
          height: '100px'
        }
      }}
    >
      {!bakerList.length ? (
        <Text textAlign="center" color="gray.600" fontSize="16px">
          No bakers match your search
        </Text>
      ) : (
        bakerList.map((baker, index) => (
          <BakerBox
            baker={baker}
            setSelectedBaker={setSelectedBaker}
            handleOneStepForward={handleOneStepForward}
            currentBakerAddress={currentBakerAddress}
            key={index}
          />
        ))
      )}
    </Flex>
  )
}

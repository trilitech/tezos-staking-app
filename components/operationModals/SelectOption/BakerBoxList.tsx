import React from 'react'
import { Flex } from '@chakra-ui/react'
import { BakerBox } from './BakerBox'
import { BakerInfo } from '@/components/Operations/tezInterfaces'

interface BakerBoxListProps {
  bakerList: BakerInfo[]
  setSelectedBaker: (b: BakerInfo | null) => void
  handleOneStepForward: () => void
}

export const BakerBoxList = ({
  bakerList,
  setSelectedBaker,
  handleOneStepForward
}: BakerBoxListProps) => {
  return (
    <Flex
      flexDir='column'
      overflowY='scroll'
      maxH={['340px', '420px']}
      gap='12px'
      sx={{
        '::-webkit-scrollbar': {
          width: '4px'
        },
        '::-webkit-scrollbar-thumb': {
          background: '#E2E8F0',
          borderRadius: '8px',
          height: '100px'
        }
      }}
    >
      {bakerList.map((baker, index) => (
        <BakerBox
          baker={baker}
          setSelectedBaker={setSelectedBaker}
          handleOneStepForward={handleOneStepForward}
          key={index}
        />
      ))}
    </Flex>
  )
}

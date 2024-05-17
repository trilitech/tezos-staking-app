import React, { useState } from 'react'
import { Image, Box, Flex, Text, Spinner } from '@chakra-ui/react'
import useClipboard from '@/utils/useClipboard'
import { simplifyAddress } from '@/utils/simpliftAddress'
import { BakerInfo } from '../Operations/tezInterfaces'

export const BakerListDropDown = ({
  bakerList,
  setSelectedBaker,
  setIsDropdownOpen
}: {
  bakerList: BakerInfo[]
  setSelectedBaker: (b: BakerInfo | null) => void
  setIsDropdownOpen: (val: boolean) => void
}) => {
  const [hoverCopyIcon, setHoverCopyIcon] = useState(false)
  const { copyTextToClipboard } = useClipboard()

  return (
    <Flex flexDir='column' alignItems='center' justify='center' mt='20px'>
      <Text color='#171923' fontSize='20px' fontWeight={600}>
        Select Baker
      </Text>
      {bakerList.length === 0 && <Spinner />}
      <Flex flexDir='column' maxH='300px' overflowY='auto' w='full' mt='15px'>
        {bakerList?.map((baker, index) => (
          <Flex
            flexDir='column'
            alignItems='start'
            p='8px'
            _hover={{ cursor: 'pointer' }}
            onClick={() => {
              if (!hoverCopyIcon) {
                setSelectedBaker(baker)
                setIsDropdownOpen(false)
              }
            }}
            key={index}
          >
            <Box>
              <Text fontSize='16px' fontWeight={600}>
                Private Baker
              </Text>
              <Flex alignItems='center' justify='center' gap='5px'>
                <Text fontSize='14px'>{simplifyAddress(baker.address)}</Text>
                <Image
                  _hover={{ cursor: 'pointer' }}
                  zIndex={10}
                  onClick={() => copyTextToClipboard(baker.address)}
                  onMouseEnter={() => setHoverCopyIcon(true)}
                  onMouseLeave={() => setHoverCopyIcon(false)}
                  src='/images/copy-icon.svg'
                  alt='copy icon'
                />
              </Flex>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

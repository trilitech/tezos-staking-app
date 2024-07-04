import React, { useState } from 'react'
import { Image, Box, Flex, Text, Spinner } from '@chakra-ui/react'
import useClipboard from '@/utils/useClipboard'
import { simplifyAddress } from '@/utils/simpliftAddress'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { CopyAlert } from '@/components/CopyAlert'

export const BakerListDropDown = ({
  bakerList,
  setSelectedBaker,
  setIsDropdownOpen,
  setShowStepper
}: {
  bakerList: BakerInfo[]
  setSelectedBaker: (b: BakerInfo | null) => void
  setIsDropdownOpen: (val: boolean) => void
  setShowStepper: (arg: boolean) => void
}) => {
  const [hoverCopyIcon, setHoverCopyIcon] = useState(false)
  const { isCopied, copyTextToClipboard } = useClipboard()

  return (
    <Flex flexDir='column' alignItems='center' justify='center'>
      {isCopied && <CopyAlert />}
      <Text color='#171923' fontSize='20px' fontWeight={600}>
        Select Baker
      </Text>
      {bakerList.length === 0 && <Spinner />}
      <Flex
        flexDir='column'
        maxH='300px'
        w='full'
        mt='24px'
        overflowY='auto'
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
        {bakerList?.map((baker, index) => (
          <Flex
            p='16px'
            borderBottom='solid 1px #EDF2F7'
            _hover={{ cursor: 'pointer', bg: '#F7FAFC' }}
            onClick={() => {
              if (!hoverCopyIcon) {
                setSelectedBaker(baker)
                setIsDropdownOpen(false)
                setShowStepper(true)
              }
            }}
            justify='space-between'
            key={index}
          >
            <Flex alignItems='start' gap='10px'>
              <Image
                w='40px'
                h='40px'
                src={`${process.env.NEXT_PUBLIC_TZKT_AVATARS_URL}/${baker.address}`}
                alt='baker avatar'
              />
              <Box>
                <Text fontSize='16px' color='#171923' fontWeight={600}>
                  {baker.alias}
                </Text>
                <Flex alignItems='center' justify='center' gap='5px'>
                  <Text color='#2D3748' fontWeight={400} fontSize='14px'>
                    {simplifyAddress(baker.address)}
                  </Text>
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
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

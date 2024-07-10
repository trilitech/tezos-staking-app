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
        maxH='420px'
        w='full'
        mt='24px'
        overflowY='auto'
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
        {bakerList?.map((baker, index) => (
          <Flex
            flexDir='column'
            p='16px'
            border='solid 1.5px #EDF2F7'
            borderRadius='12px'
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
            <Flex
              flexDir={['column', 'row']}
              justify='space-evenly'
              alignItems='start'
              gap='10px'
              mt='10px'
              pt='10px'
              borderTop='solid 1px #EDF2F7'
              flexWrap='wrap'
            >
              <CustomFlex>
                <Text fontSize='14px' fontWeight={600} color='#4A5568' mr='3px'>
                  STAKING:
                </Text>
                <Text color='#171923' fontWeight={600} fontSize='14px'>
                  {baker.totalStakedBalance} ꜩ
                </Text>
              </CustomFlex>
              <CustomFlex>
                <Text fontSize='14px' fontWeight={600} color='#4A5568' mr='3px'>
                  FREE SPACE:
                </Text>
                <Text color='#171923' fontWeight={600} fontSize='14px'>
                  {Math.floor(baker.stakingFreeSpace)} ꜩ
                </Text>
              </CustomFlex>
              <CustomFlex>
                <Text fontSize='14px' fontWeight={600} color='#4A5568' mr='3px'>
                  FEE:
                </Text>
                <Text color='#171923' fontWeight={600} fontSize='14px'>
                  {baker.stakingFees}%
                </Text>
              </CustomFlex>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

const CustomFlex = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex alignItems='center' justify='space-between' w={['100%', 'auto']}>
      {children}
    </Flex>
  )
}

import React from 'react'
import { Flex, Image, Box, Text } from '@chakra-ui/react'
import { SecondaryButton } from '@/components/buttons/SecondaryButton'
import { simplifyAddress } from '@/utils/simpliftAddress'
import useClipboard from '@/utils/useClipboard'
import { CopyAlert } from '@/components/CopyAlert'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { mutezToTez } from '@/utils/mutezToTez'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

interface BakerBoxProps {
  baker: BakerInfo
  setSelectedBaker: (b: BakerInfo | null) => void
  handleOneStepForward: () => void
}

export const BakerBox = ({
  baker,
  setSelectedBaker,
  handleOneStepForward
}: BakerBoxProps) => {
  const { isCopied, copyTextToClipboard } = useClipboard()

  return (
    <Flex
      flexDir='column'
      border='solid 1.5px #EDF2F7'
      borderRadius='12px'
      _hover={{ bg: '#F7FAFC' }}
    >
      {isCopied && <CopyAlert />}
      <Flex justify='space-between' alignItems='center' px='16px' py='12px'>
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
                src='/images/copy-icon.svg'
                alt='copy icon'
              />
            </Flex>
          </Box>
        </Flex>
        <Box>
          <SecondaryButton
            onClick={() => {
              trackGAEvent(
                GAAction.BUTTON_CLICK,
                GACategory.CHOOSE_BAKER_SUCCESS
              )
              setSelectedBaker(baker)
              handleOneStepForward()
            }}
            px='12px'
            py='6px'
            lineHeight='22px'
            h='100%'
            fontSize='16px'
          >
            Select
          </SecondaryButton>
        </Box>
      </Flex>
      <Flex
        flexDir={['column', 'row']}
        justify='space-evenly'
        alignItems='start'
        gap='10px'
        px='16px'
        py='12px'
        borderTop='solid 1px #EDF2F7'
        flexWrap='wrap'
      >
        <CustomFlex>
          <Text fontSize='14px' fontWeight={600} color='#4A5568' mr='3px'>
            TOTAL:
          </Text>
          <Text color='#171923' fontWeight={600} fontSize='14px'>
            {Math.floor(mutezToTez(baker.totalStakedBalance))} ꜩ
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
        <CustomFlex>
          <Text fontSize='14px' fontWeight={600} color='#4A5568' mr='3px'>
            FREE SPACE:
          </Text>
          <Text color='#171923' fontWeight={600} fontSize='14px'>
            {Math.floor(baker.stakingFreeSpace)} ꜩ
          </Text>
        </CustomFlex>
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

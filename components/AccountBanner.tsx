import React from 'react'
import { Flex, FlexProps, Image, Text, Button } from '@chakra-ui/react'
import { useConnection } from '@/providers/ConnectionProvider'
import useClipboard from '@/utils/useClipboard'
import { simplifyAddress } from '@/utils/simpliftAddress'
import { CopyAlert } from './CopyAlert'

export const AccountBanner = ({
  address,
  name,
  ...styles
}: {
  address: string
  name: string
} & FlexProps) => {
  const { isCopied, copyTextToClipboard } = useClipboard()
  const { disconnect } = useConnection()

  return (
    <Flex
      alignItems='center'
      justify='space-between'
      px={['20px', null, '40px']}
      py='20px'
      borderRadius='16px'
      bg='#FFF'
      w='100%'
      {...styles}
    >
      {isCopied && <CopyAlert />}

      <Image w='110px' h='38px' src='/images/logo.svg' alt='Tezos Logo' />
      <Flex flexDir='column' gap='5px' pos='relative'>
        <Text
          fontWeight={600}
          fontSize='16px'
          lineHeight='22px'
          alignSelf='center'
        >
          {name}
        </Text>
        <Flex gap='4px'>
          <Text fontWeight={400} lineHeight='18px' fontSize='14px'>
            {simplifyAddress(address)}
          </Text>
          <Image
            color='#A0AEC0'
            _hover={{ cursor: 'pointer' }}
            src='/images/copy-icon.svg'
            alt='copy icon'
            onClick={() => copyTextToClipboard(address)}
          />
        </Flex>
      </Flex>
      <Flex gap='3'>
        <Button
          border='solid 1px #EDF2F7'
          px='12px'
          py='24px'
          borderRadius='8px'
          bg='transparent'
          as='a'
          href='/faqs'
          target='_blank'
          _hover={{
            bg: '#f8fafc'
          }}
        >
          <Image
            w='24px'
            h='24px'
            src='/images/help-icon-dapp.svg'
            alt='logout'
          />
        </Button>
        <Button
          border='solid 1px #EDF2F7'
          px='12px'
          py='24px'
          borderRadius='8px'
          bg='transparent'
          _hover={{
            bg: '#f8fafc'
          }}
        >
          <Image
            w='24px'
            h='24px'
            onClick={() => disconnect()}
            src='/images/logout.svg'
            alt='logout'
          />
        </Button>
      </Flex>
    </Flex>
  )
}

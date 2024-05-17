import React from 'react'
import {
  Flex,
  FlexProps,
  Image,
  Text,
  Button,
  Alert,
  AlertIcon
} from '@chakra-ui/react'
import { useConnection } from '@/components/ConnectionProvider'
import useClipboard from '@/utils/useClipboard'

export const simplifyAddress = (address: string) =>
  address.slice(0, 8) + '...' + address.slice(-4)

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
      justify='space-around'
      py='20px'
      borderRadius='16px'
      bg='#FFF'
      w='100%'
      {...styles}
    >
      {isCopied && (
        <Alert
          pos='absolute'
          top='50px'
          w='200px'
          textAlign='center'
          status='success'
          borderRadius='10px'
        >
          <AlertIcon />
          Copied
        </Alert>
      )}

      <Image w='110px' h='38px' src='/images/logo.svg' alt='Tezos Logo' />
      <Flex flexDir='column' justify='center' alignItems='center' gap='5px'>
        <Flex justify='center' alignItems='center' gap='5px'>
          <Image src='/images/account-circle.svg' alt='account circle' />
          <Text>{name}</Text>
        </Flex>
        <Flex alignItems='center' justify='center' gap='10px'>
          <Text fontSize='14px'>{simplifyAddress(address)}</Text>
          <Image
            _hover={{ cursor: 'pointer' }}
            src='/images/copy-icon.svg'
            alt='copy icon'
            onClick={() => copyTextToClipboard(address)}
          />
        </Flex>
      </Flex>
      <Button
        border='solid 1px #EDF2F7'
        px='12px'
        borderRadius='8px'
        bg='transparent'
        _hover={{
          bg: 'transparent'
        }}
      >
        <Image
          w='20px'
          onClick={() => disconnect()}
          src='/images/logout.svg'
          alt='logout'
        />
      </Button>
    </Flex>
  )
}

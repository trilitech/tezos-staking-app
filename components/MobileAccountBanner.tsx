import React, { useEffect, useState } from 'react'
import {
  Flex,
  Image,
  Text,
  Button,
  FlexProps,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerFooter,
  useDisclosure
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { DisconnectButton } from './buttons/DisconnectButton'
import { simplifyAddress } from './AccountBanner'
import useClipboard from '@/utils/useClipboard'

export const MobileAccountBanner = ({
  address,
  name,
  ...styles
}: { address: string; name: string } & FlexProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { copyTextToClipboard } = useClipboard()

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
      if (windowSize.width >= 768) onClose()
    }

    // Set up event listener for window resize
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [windowSize.width])

  return (
    <Flex
      alignItems='center'
      justify='space-between'
      p='24px'
      borderRadius='16px'
      bg='#FFF'
      w='100%'
      {...styles}
    >
      <Image w='110px' h='38px' src='/images/logo.svg' alt='Tezos Logo' />
      <Button
        border='solid 1px #EDF2F7'
        px='12px'
        borderRadius='8px'
        bg='transparent'
        _hover={{
          bg: 'transparent'
        }}
        onClick={onOpen}
      >
        <HamburgerIcon fontSize='20px' />
      </Button>
      <Drawer placement='bottom' onClose={onClose} isOpen={isOpen} size='xl'>
        <DrawerOverlay />
        <DrawerContent borderRadius='10px' py='40px'>
          <DrawerCloseButton />

          <DrawerBody mb='10px'>
            <Flex flexDir='column' alignItems='center' gap='16px'>
              <Flex flexDir='column' alignItems='center'>
                <Image
                  src='/images/mobile-account-circle.svg'
                  alt='account circle'
                />
                <Text fontSize='18px' fontWeight={600}>
                  {name}
                </Text>
              </Flex>
              <Flex
                alignItems='center'
                justify='center'
                gap='10px'
                border='solid 1px #E2E8F0'
                borderRadius='100px'
                w='200px'
                px='16px'
                py='8px'
                onClick={() => copyTextToClipboard(address)}
              >
                <Text fontSize='14px'>{simplifyAddress(address)}</Text>
                <Image
                  _hover={{ cursor: 'pointer' }}
                  src='/images/copy-icon.svg'
                  alt='copy icon'
                />
              </Flex>
            </Flex>
          </DrawerBody>
          <DrawerFooter>
            <DisconnectButton w='100%' bg='black' color='white' />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}

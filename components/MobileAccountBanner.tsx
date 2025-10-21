import React, { useEffect, useState } from 'react'
import {
  Flex,
  Image,
  Text,
  Button,
  FlexProps,
  Icon,
  Drawer,
  Box,
  Portal,
  CloseButton
} from '@chakra-ui/react'
import { Menu as HamburgerIcon } from 'lucide-react'
import { TertiaryButton } from './buttons/TertiaryButton'
import { simplifyAddress } from '@/utils/simpliftAddress'
import useClipboard from '@/utils/useClipboard'
import { useConnection } from '../providers/ConnectionProvider'
import { PrimaryButton } from './buttons/PrimaryButton'

export const MobileAccountBanner = ({
  address,
  name,
  ...styles
}: { address: string; name: string } & FlexProps) => {
  const [open, setOpen] = useState(false)
  const { copyTextToClipboard } = useClipboard()
  const { disconnect } = useConnection()

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
      if (windowSize.width >= 768) setOpen(false)
    }

    // Set up event listener for window resize
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [windowSize.width])

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
      <Image w='92px' h='32px' src='/images/logo.svg' alt='Tezos Logo' />
      <Box>
        <Button
          border='solid 1px #E2E8F0'
          px='15px'
          py='8px'
          borderRadius='4px'
          bg='transparent'
          _hover={{
            bg: 'transparent'
          }}
          onClick={() => setOpen(true)}
        >
          <Icon as={HamburgerIcon} w='18px' h='18px' color='gray.900' />
        </Button>
      </Box>
      <Drawer.Root
        placement='bottom'
        open={open}
        onOpenChange={e => setOpen(e.open)}
        size='xl'
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content
              pos='relative'
              borderTopRadius='10px'
              py={10}
              px={10}
              bg='white'
            >
              <CloseButton
                position='absolute'
                top='0px'
                right='10px'
                w='fit-content'
                color='gray.600'
                onClick={() => setOpen(false)}
              />
              <Drawer.Body>
                <Flex flexDir='column' alignItems='center' gap='16px'>
                  <Text fontSize='18px' fontWeight={600}>
                    {name}
                  </Text>
                  <Flex
                    alignItems='center'
                    justify='center'
                    gap='4px'
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
              </Drawer.Body>
              <Image
                my='24px'
                src='/images/mobile-footer-line.svg'
                alt='line'
              />
              <Drawer.Footer display='flex' flexDir='column' gap='16px'>
                <PrimaryButton w='full' onClick={disconnect}>
                  Help
                </PrimaryButton>
                <TertiaryButton onClick={disconnect}>Disconnect</TertiaryButton>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Flex>
  )
}

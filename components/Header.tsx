import {
  Box,
  Button,
  Flex,
  Image,
  Link as ChakraLink,
  Text
} from '@chakra-ui/react'
import { useConnection } from '@/providers/ConnectionProvider'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CustomButton } from './buttons/CustomButton'

export const Header = () => {
  const { isConnected, connect, disconnect } = useConnection()
  const router = useRouter()
  const [connectClicked, setConnectClicked] = useState(false)

  useEffect(() => {
    if (isConnected && connectClicked) {
      window.location.href = '/'
    }
  }, [isConnected, router, connectClicked])

  return (
    <Box
      zIndex='1000'
      position='sticky'
      top={0}
      w='100%'
      left='0'
      right='0'
      mx='auto'
      pt={['24px', null, '40px']}
    >
      <Flex
        alignItems='center'
        flexDir='column'
        boxShadow='boxShadow'
        as='header'
        bg='#FFFFFF0A'
        backdropFilter='blur(22px)'
        maxW='1232px'
        borderRadius='16px'
        justifyContent='center'
        mx='auto'
      >
        <Flex
          w='100%'
          px={['16px', null, '48px']}
          py={['12px', null, '24px']}
          borderColor='gray.50'
          justifyContent='space-between'
          alignItems='center'
        >
          <Flex flex={1}>
            <ChakraLink href='/'>
              <Button
                as='div'
                display='inline-flex'
                alignItems='center'
                bg='transparent'
                _hover={{ bg: 'transparent' }}
                border='none'
                p={0}
              >
                <Image
                  maxW='125px'
                  h={['32px', null, '44px']}
                  src='/images/logo_white.svg'
                  alt='Tezos Logo'
                />
              </Button>
            </ChakraLink>
          </Flex>
          <Flex alignItems='center' justifyContent='end' flex={1} gap={4}>
            <CustomButton px={[0, null, '24px']} variant='ternary' asChild>
              <Link href='/faqs'>
                <Image
                  pr={[0, null, '8px']}
                  maxW='110px'
                  src='/images/info-icon.svg'
                  alt='Wallet Icon'
                />
                <Text display={['none', null, 'inline']}>Help</Text>
              </Link>
            </CustomButton>

            {isConnected !== undefined && (
              <CustomButton
                variant='primary'
                onClick={
                  isConnected
                    ? disconnect
                    : () => {
                        trackGAEvent(
                          GAAction.BUTTON_CLICK,
                          GACategory.WALLET_BEGIN
                        )
                        setConnectClicked(true)
                        connect()
                      }
                }
                {...(isConnected ? { ternary: true } : { primary: true })}
                border={isConnected ? 'solid 2px #EDF2F7' : undefined}
                px={isConnected ? '12px' : ['12px', null, '24px']}
                py={isConnected ? '24px' : undefined}
                borderRadius={isConnected ? '8px' : undefined}
                minW={isConnected ? undefined : ['48px', null, 'auto']}
              >
                <Image
                  w='24px'
                  h='24px'
                  src={
                    isConnected
                      ? '/images/logout_white.svg'
                      : '/images/wallet-icon.svg'
                  }
                  alt={isConnected ? 'Logout' : 'Wallet Icon'}
                />
                {!isConnected && (
                  <Text display={['none', null, 'inline']}>Connect</Text>
                )}
              </CustomButton>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}

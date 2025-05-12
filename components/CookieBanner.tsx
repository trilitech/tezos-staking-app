import React, { useState, useEffect } from 'react'
import {
  Flex,
  Text,
  Dialog,
  Box,
  Link as ChakraLink,
  chakra
} from '@chakra-ui/react'
import Link from 'next/link'
import { PrimaryButton } from './buttons/PrimaryButton'
import { SecondaryButton } from './buttons/SecondaryButton'
import Cookies from 'js-cookie'

function injectGoogleAnalyticsScripts() {
  const script1 = document.createElement('script')
  script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-39LG2721KV'
  script1.async = true

  const script2 = document.createElement('script')
  script2.text = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-39LG2721KV');
  `

  document.head.appendChild(script1)
  document.head.appendChild(script2)
}

export const CookieBanner = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const consent = Cookies.get('cookie-consent')
    if (!consent) {
      setIsOpen(true)
    } else if (consent === 'accepted') {
      injectGoogleAnalyticsScripts()
    }
  }, [])

  const handleAccept = () => {
    Cookies.set('cookie-consent', 'accepted', { expires: 365 })
    injectGoogleAnalyticsScripts()
    setIsOpen(false)
  }

  return (
    <Dialog.Root
      isOpen={isOpen}
      onClose={() => {
        console.log('click')
      }}
    >
      <Dialog.Backdrop />
      <Dialog.Content asChild>
        <chakra.div
          pos='absolute'
          bottom={{ base: 0, md: 10 }}
          borderRadius='4px'
          px={{ base: 10, md: 12 }}
          py={{ base: 10, md: 6 }}
          m='0'
          maxW='1232px'
          w={{ base: '100%', md: '90%' }}
          borderTopStartRadius='16px'
          borderBottomStartRadius={{ md: '16px' }}
          borderTopEndRadius='16px'
          borderBottomEndRadius={{ md: '16px' }}
        >
          {/* dialog content */}
        </chakra.div>
      </Dialog.Content>
      {/* <Dialog.Content
      // pos='absolute'
      // bottom={[0, null, 10]}
      // borderRadius={4}
      // px={[10, null, 12]}
      // py={[10, 6]}
      // m={0}
      // maxW='1232px'
      // w={['100%', null, '90%']}
      // borderTopStartRadius='16px'
      // borderBottomStartRadius={[null, null, '16px']}
      // borderTopEndRadius='16px'
      // borderBottomEndRadius={[null, null, '16px']}
      >
        <Dialog.Body
          display='flex'
          flexDir={['column', null, 'row']}
          justifyContent='space-between'
          alignItems='center'
          gap={10}
          pb={0}
          px={0}
        >
          <Box textAlign={['center', null, 'start']}>
            <Text
              fontSize='20px'
              lineHeight='26px'
              color='#10121B'
              mb={['12px', null, '6px']}
            >
              We use cookies to make your experience better.
            </Text>
            <ChakraLink as={Link} href='/cookie_policy/' target='_blank'>
              <Text
                fontSize='18px'
                fontWeight={600}
                lineHeight='24px'
                textDecor='underline'
                color='#10121B'
              >
                Cookie Policy
              </Text>
            </ChakraLink>
          </Box>
          <Flex
            flexDir={['column', null, 'row']}
            gap='18px'
            w={['full', null, 'auto']}
          >
            <PrimaryButton onClick={() => handleAccept()}>
              <Text>Accept Cookies</Text>
            </PrimaryButton>
            <SecondaryButton onClick={() => handleAccept()}>
              <Text>Necessary Only</Text>
            </SecondaryButton>
          </Flex>
        </Dialog.Body>
      </Dialog.Content> */}
    </Dialog.Root>
  )
}

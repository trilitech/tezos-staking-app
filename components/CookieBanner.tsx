import React from 'react'
import {
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box
} from '@chakra-ui/react'
import Link from 'next/link'
import { PrimaryButton } from './buttons/PrimaryButton'
import { SecondaryButton } from './buttons/SecondaryButton'

export const CookieBanner = () => {
  return (
    <Modal
      isOpen={true}
      onClose={() => {
        console.log('click')
      }}
    >
      <ModalOverlay />
      <ModalContent
        pos='absolute'
        bottom={[0, null, 10]}
        borderRadius={4}
        px={[10, 12]}
        py={[10, 6]}
        m={0}
        maxW='1232px'
        w={['100%', null, '90%']}
      >
        <ModalBody
          display='flex'
          flexDir={['column', null, 'row']}
          justifyContent='space-between'
          gap={10}
        >
          <Box textAlign={['center', null, 'start']}>
            <Text
              fontSize='20px'
              lineHeight='26px'
              color='#10121B'
              mb={[3, null, 0]}
            >
              We use cookies to make your experience better.
            </Text>
            <Link href='/cookie_policy/' target='_blank'>
              <Text
                fontSize='18px'
                fontWeight={600}
                lineHeight='24px'
                textDecor='underline'
                color='#10121B'
              >
                Cookie Policy
              </Text>
            </Link>
          </Box>
          <Flex flexDir={['column', null, 'row']} gap='18px'>
            <PrimaryButton onClick={() => console.log('accept')}>
              <Text>Accept Cookies</Text>
            </PrimaryButton>
            <SecondaryButton onClick={() => console.log('accept')}>
              <Text>Necessary Only</Text>
            </SecondaryButton>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

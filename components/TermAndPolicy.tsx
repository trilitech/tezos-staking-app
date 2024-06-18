import React from 'react'
import {
  Flex,
  Text,
  FlexProps,
  TextProps,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import Link from 'next/link'
import { useConnection } from '@/providers/ConnectionProvider'

export const TermAndPolicy = ({ ...styles }: FlexProps) => {
  const { isConnected } = useConnection()
  const termsModal = useDisclosure()

  return (
    <>
      <Flex
        flexDir={['column', 'row']}
        justify='space-between'
        w='100%'
        alignItems='center'
        fontSize='14px'
        gap='24px'
        fontWeight={400}
        {...styles}
      >
        <Text color={isConnected ? '#2D3748' : '#FFFFFF'}>
          © 2024 Trilitech Limited
          <Divider mx='5px' />{' '}
          <Text
            as='span'
            onClick={termsModal.onOpen}
            _hover={{ cursor: 'pointer' }}
          >
            Terms
          </Text>
        </Text>

        <Text color={isConnected ? '#718096' : '#E2E8F0'}>
          Powered by{' '}
          <Link href='https://tezos.com' target='_blank'>
            <Text
              as='span'
              textDecor='underline'
              _hover={{ color: `${isConnected ? '#003ee0' : 'white'}` }}
              transition='color 0.2s ease-in-out'
            >
              Tezos
            </Text>
          </Link>
        </Text>
      </Flex>
      <TermsModal isOpen={termsModal.isOpen} onClose={termsModal.onClose} />
    </>
  )
}

const Divider = ({ ...styles }: TextProps) => {
  const { isConnected } = useConnection()

  return (
    <Text
      as='span'
      fontWeight={400}
      color={isConnected ? '#CBD5E0' : '#718096'}
      {...styles}
    >
      |
    </Text>
  )
}

const TermsModal = ({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Terms and Use</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            MIT License Copyright (c) 2018-2024 Trilitech Limited
            &lt;tezos-staking-app@trili.tech&gt;
          </Text>
          <Text mb={4}>
            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files
            (the &quot;Software&quot;), to deal in the Software without
            restriction, including without limitation the rights to use, copy,
            modify, merge, publish, distribute, sublicense, and/or sell copies
            of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:
          </Text>
          <Text mb={4}>
            The above copyright notice and this permission notice shall be
            included in all copies or substantial portions of the Software.
          </Text>
          <Text>
            THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY
            KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
            CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

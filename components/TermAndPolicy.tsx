import React, { useEffect, useState } from 'react'
import axios from 'axios'
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
            Terms of Use
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
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    const fetchHtmlContent = async () => {
      try {
        const response = await axios.get('/termsOfUseStakingApp.html')
        setHtmlContent(response.data)
      } catch (error) {
        console.error('Failed to fetch HTML content:', error)
      }
    }

    fetchHtmlContent()
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxH='80vh'>
        <ModalHeader>Terms of use</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY='auto'>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

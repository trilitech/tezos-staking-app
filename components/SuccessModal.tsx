import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Flex,
  Text,
  Link as ChakraLink
} from '@chakra-ui/react'
import { PrimaryButton } from './buttons/PrimaryButton'
import Link from 'next/link'
import { ExternalLinkIcon } from '@chakra-ui/icons'

export const SuccessModal = ({
  title,
  desc,
  tzktLink,
  resetOperation,
  open
}: {
  title?: string
  desc: string
  tzktLink: string
  resetOperation: () => void
  open: boolean
}) => {
  const { onClose } = useDisclosure()

  return (
    <Modal isOpen={open} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton
          onClick={() => {
            resetOperation()
            onClose()
          }}
        />
        <ModalBody mt='40px'>
          <Flex
            textAlign='center'
            flexDir='column'
            justify='center'
            alignItems='center'
          >
            <Image
              w='24px'
              h='24px'
              src='/images/check.svg'
              alt='check icon'
              mb='16px'
            />
            <Text fontWeight={600} color='#171923' fontSize='24px' mb='16px'>
              {!!title ? title : 'Nicely Done!'}
            </Text>
            <Text
              fontWeight={400}
              color='#2D3748'
              fontSize='16px'
              maxW='300px'
              mb='16px'
              lineHeight='22px'
            >
              {desc}
            </Text>
            <PrimaryButton
              onClick={() => {
                resetOperation()
                onClose()
              }}
            >
              Continue
            </PrimaryButton>
            <ChakraLink
              as={Link}
              href={tzktLink}
              target='_blank'
              display='flex'
              alignItems='center'
              gap='5px'
              mt='24px'
              _hover={{
                cursor: 'pointer'
              }}
            >
              <Text color='#2D3748' fontSize='14px' fontWeight={600}>
                View in TzKT
              </Text>
              <ExternalLinkIcon color='#A0AEC0' />
            </ChakraLink>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

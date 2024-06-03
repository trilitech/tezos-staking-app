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
  desc,
  tzktLink,
  resetOperation,
  open
}: {
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
        <ModalBody py='40px'>
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
            <Text fontWeight={600} fontSize='24px' mb='16px'>
              Nicely Done!
            </Text>
            <Text fontWeight={400} fontSize='16px' maxW='300px' mb='16px'>
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
              <Text fontSize='14px'>View in TzKT</Text>
              <ExternalLinkIcon />
            </ChakraLink>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

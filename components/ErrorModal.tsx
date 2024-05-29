'use client'
import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Text
} from '@chakra-ui/react'
import { PrimaryButton } from './buttons/PrimaryButton'

export const ErrorModal = ({
  message = 'Something went wrong. Please refresh.'
}: {
  message?: string
}) => {
  const { onClose } = useDisclosure()

  return (
    <Modal isOpen onClose={onClose} size='lg'>
      <ModalOverlay />
      <ModalContent>
        <ModalBody h='800px' py='50px' textAlign='center'>
          <Text fontWeight={600} mb='20px'>
            {message}
          </Text>
          <PrimaryButton onClick={() => window.location.reload()}>
            Refresh
          </PrimaryButton>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

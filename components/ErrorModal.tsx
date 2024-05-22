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
import { useRouter } from 'next/navigation'

export const ErrorModal = ({ message }: { message: string }) => {
  const { onClose } = useDisclosure()
  const router = useRouter()

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

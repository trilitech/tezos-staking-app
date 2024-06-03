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
  onClick,
  btnText,
  message = 'Something went wrong. Please refresh.'
}: {
  onClick: () => void
  btnText: string
  message?: string
}) => {
  const { onClose } = useDisclosure()

  return (
    <Modal isOpen onClose={onClose} size='lg' isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody h='800px' py='50px' textAlign='center'>
          <Text fontWeight={600} mb='20px'>
            {message}
          </Text>
          <PrimaryButton onClick={onClick}>{btnText}</PrimaryButton>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

'use client'
import React from 'react'
import { Dialog, useDisclosure, Text } from '@chakra-ui/react'
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
    <Dialog.Root isOpen onClose={onClose} size='lg' placement='center'>
      <Dialog.Backdrop />
      <Dialog.Content>
        <Dialog.Body h='800px' py='50px' textAlign='center'>
          <Text fontWeight={600} mb='20px'>
            {message}
          </Text>
          <PrimaryButton onClick={onClick}>{btnText}</PrimaryButton>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  )
}

import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Text
} from '@chakra-ui/react'
import { DisconnectButton } from './buttons/DisconnectButton'
import { useConnection } from './ConnectionProvider'

export const ErrorModal = () => {
  const { onClose } = useDisclosure()
  const { disconnect } = useConnection()

  return (
    <Modal isOpen onClose={onClose} size='lg'>
      <ModalOverlay />
      <ModalContent>
        <ModalBody h='800px' py='50px' textAlign='center'>
          <Text fontWeight={600} mb='20px'>
            Something went wrong.
            <br /> Please reconnect your wallet.
          </Text>
          <DisconnectButton onClick={disconnect} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

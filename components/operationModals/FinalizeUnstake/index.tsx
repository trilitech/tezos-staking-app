import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import useCurrentStep from '@/utils/useCurrentStep'
import { ConfirmFinalizeUnstake } from './ConfirmFinalizeUnstake'
import { GetFees } from '@/components/Operations/operations'

interface FinalizeUnstakeModal {
  withdrawAmount: number
  isOpen: boolean
  onClose: () => void
}

enum EndDelegateStatus {
  ConfirmFinalizeUnstake = 1
}

export const FinalizeUnstakeModal = ({
  withdrawAmount,
  isOpen,
  onClose
}: FinalizeUnstakeModal) => {
  const { currentStep, handleOneStepForward } = useCurrentStep(onClose, 1)

  const getCurrentStepBody = (currentStep: number) => {
    switch (currentStep) {
      case EndDelegateStatus.ConfirmFinalizeUnstake:
        return (
          <ConfirmFinalizeUnstake
            withdrawAmount={withdrawAmount}
            opFees={GetFees('finalizeUnstake', withdrawAmount)}
            handleOneStepForward={handleOneStepForward}
          />
        )
      default:
        console.error('End delegation step is not defined')
        return
    }
  }

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent pb='20px'>
        <ModalHeader>
          <Flex justify='end'>
            <CloseIcon
              fontSize='14px'
              onClick={onClose}
              _hover={{ cursor: 'pointer' }}
            />
          </Flex>
        </ModalHeader>

        <ModalBody>
          <Flex flexDir='column'>{getCurrentStepBody(currentStep)}</Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex
} from '@chakra-ui/react'
import useCurrentStep from '@/utils/useCurrentStep'
import { ConfirmFinalizeUnstake } from './ConfirmFinalizeUnstake'
import { CloseIcon } from '@/components/icons'

interface FinalizeUnstakeModal {
  spendableBalance: number
  withdrawAmount: number
  isOpen: boolean
  onClose: () => void
}

enum EndDelegateStatus {
  ConfirmFinalizeUnstake = 1
}

export const FinalizeUnstakeModal = ({
  spendableBalance,
  withdrawAmount,
  isOpen,
  onClose
}: FinalizeUnstakeModal) => {
  const { currentStep, handleOneStepForward, resetStep } = useCurrentStep(
    onClose,
    1
  )

  const closeReset = () => {
    resetStep()
  }

  const getCurrentStepBody = (currentStep: number) => {
    switch (currentStep) {
      case EndDelegateStatus.ConfirmFinalizeUnstake:
        return (
          <ConfirmFinalizeUnstake
            spendableBalance={spendableBalance}
            withdrawAmount={withdrawAmount}
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
      <ModalContent>
        <ModalHeader>
          <Flex justify='end'>
            <CloseIcon
              onClick={() => {
                closeReset()
                onClose()
              }}
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

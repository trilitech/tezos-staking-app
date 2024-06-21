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
import { ConfirmEndDelegate } from './ConfirmEndDelegate'
import { BackIcon, CloseIcon } from '@/components/icons'

interface EndDelegateModal {
  isOpen: boolean
  onClose: () => void
  bakerName: string
  spendableBalance: number
}

enum EndDelegateStatus {
  EndDelegation = 1
}

export const EndDelegationModal = ({
  isOpen,
  onClose,
  bakerName,
  spendableBalance
}: EndDelegateModal) => {
  const totalStep = 1

  const { currentStep, handleOneStepBack, handleOneStepForward, resetStep } =
    useCurrentStep(onClose, totalStep)

  const closeReset = () => {
    resetStep()
  }

  const getCurrentStepBody = (currentStep: number) => {
    switch (currentStep) {
      case EndDelegateStatus.EndDelegation:
        return (
          <ConfirmEndDelegate
            handleOneStepForward={handleOneStepForward}
            spendableBalance={spendableBalance}
            bakerName={bakerName}
          />
        )
      default:
        console.error('End delegation step is not defined')
        break
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
          <Flex justify='space-between' alignItems='center'>
            <BackIcon onClick={handleOneStepBack} />
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

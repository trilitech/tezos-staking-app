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
import { EndDelegateStart } from './EndDelegateStart'
import { ConfirmEndDelegate } from './ConfirmEndDelegate'
import { Stepper } from '@/components/modalBody/Stepper'
import { BackIcon, CloseIcon } from '@/components/icons'

interface EndDelegateModal {
  isOpen: boolean
  onClose: () => void
  bakerName: string
  spendableBalance: number
}

enum EndDelegateStatus {
  EndDelegationStart = 1,
  ConfirmEndBaker = 2
}

export const EndDelegationModal = ({
  isOpen,
  onClose,
  bakerName,
  spendableBalance
}: EndDelegateModal) => {
  const totalStep = 2

  const { currentStep, handleOneStepBack, handleOneStepForward } =
    useCurrentStep(onClose, totalStep)

  const getCurrentStepBody = (currentStep: number) => {
    switch (currentStep) {
      case EndDelegateStatus.EndDelegationStart:
        return (
          <EndDelegateStart
            bakerName={bakerName}
            handleOneStepForward={handleOneStepForward}
          />
        )
      case EndDelegateStatus.ConfirmEndBaker:
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
            <CloseIcon onClick={onClose} />
          </Flex>
        </ModalHeader>

        <ModalBody>
          <Flex flexDir='column'>
            <Stepper totalStep={totalStep} currentStep={currentStep} />
            {getCurrentStepBody(currentStep)}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

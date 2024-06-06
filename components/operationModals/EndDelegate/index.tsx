import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Image,
  Flex
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import useCurrentStep from '@/utils/useCurrentStep'
import { EndDelegateStart } from './EndDelegateStart'
import { ConfirmEndDelegate } from './ConfirmEndDelegate'
import { Stepper } from '@/components/modalBody/Stepper'

interface EndDelegateModal {
  isOpen: boolean
  onClose: () => void
  bakerAddress: string
  spendableBalance: number
}

enum EndDelegateStatus {
  EndDelegationStart = 1,
  ConfirmEndBaker = 2
}

export const EndDelegationModal = ({
  isOpen,
  onClose,
  bakerAddress,
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
            bakerAddress={bakerAddress}
            handleOneStepForward={handleOneStepForward}
          />
        )
      case EndDelegateStatus.ConfirmEndBaker:
        return (
          <ConfirmEndDelegate
            handleOneStepForward={handleOneStepForward}
            spendableBalance={spendableBalance}
            bakerAddress={bakerAddress}
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
            <Image
              onClick={handleOneStepBack}
              src='/images/FiArrowLeftCircle.svg'
              alt='back button'
              _hover={{ cursor: 'pointer' }}
            />
            <CloseIcon
              fontSize='14px'
              onClick={onClose}
              _hover={{ cursor: 'pointer' }}
            />
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

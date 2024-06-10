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
import { GetFees } from '@/components/Operations/operations'

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
  const { currentStep, handleOneStepBack, handleOneStepForward } =
    useCurrentStep(onClose, 2)

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
            opFees={GetFees('delegate', spendableBalance)}
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
      <ModalContent pb='20px'>
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
            <Stepper currentStep={currentStep} />
            {getCurrentStepBody(currentStep)}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const Stepper = ({ currentStep }: { currentStep: number }) => {
  return (
    <Flex justify='center' alignItems='center'>
      <Image pr='5px' src='/images/stepper/full-dot.svg' alt='dot' />
      <Image pr='5px' src='/images/stepper/line.svg' alt='dot' />
      {currentStep === 1 ? (
        <Image pr='5px' src='/images/stepper/empty-dot.svg' alt='dot' />
      ) : (
        <Image pr='5px' src='/images/stepper/full-dot.svg' alt='dot' />
      )}
    </Flex>
  )
}

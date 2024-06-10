import React, { useState } from 'react'
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
import { UnstakeStart } from './UnstakeStart'
import { SelectAmount } from './SelectAmount'
import { ConfirmAmount } from './ConfirmAmount'
import useCurrentStep from '@/utils/useCurrentStep'
import { GetFees } from '@/components/Operations/operations'

interface UnstakeModal {
  isOpen: boolean
  onClose: () => void
  stakedAmount: number
}

enum UnstakeStatus {
  UnstakeStart = 1,
  SelectAmount = 2,
  ConfirmUnstake = 3
}

export const UnstakeModal = ({
  isOpen,
  onClose,
  stakedAmount
}: UnstakeModal) => {
  const [unstakeAmount, setUnstakeAmount] = useState(0)
  const { currentStep, handleOneStepBack, handleOneStepForward } =
    useCurrentStep(onClose, 3)

  const getCurrentStepBody = (currentStep: number) => {
    switch (currentStep) {
      case UnstakeStatus.UnstakeStart:
        return <UnstakeStart handleOneStepForward={handleOneStepForward} />
      case UnstakeStatus.SelectAmount:
        return (
          <SelectAmount
            stakedAmount={stakedAmount}
            unstakeAmount={unstakeAmount}
            setUnstakeAmount={setUnstakeAmount}
            handleOneStepForward={handleOneStepForward}
          />
        )
      case UnstakeStatus.ConfirmUnstake:
        return (
          <ConfirmAmount
            stakedAmount={stakedAmount}
            unstakeAmount={unstakeAmount}
            unstakeFees={GetFees('unstake', unstakeAmount)}
            setUnstakeAmount={setUnstakeAmount}
            handleOneStepForward={handleOneStepForward}
          />
        )
      default:
        console.error('Delegation step is not defined')
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
      <Image pr='5px' src='/images/stepper/line.svg' alt='dot' />
      {currentStep === 3 ? (
        <Image src='/images/stepper/full-dot.svg' alt='dot' />
      ) : (
        <Image src='/images/stepper/empty-dot.svg' alt='dot' />
      )}
    </Flex>
  )
}

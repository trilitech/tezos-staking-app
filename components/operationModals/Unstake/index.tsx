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
import { Stepper } from '@/components/modalBody/Stepper'

interface UnstakeModal {
  isOpen: boolean
  onClose: () => void
  stakedAmount: number
  spendableBalance: number
}

enum UnstakeStatus {
  UnstakeStart = 1,
  SelectAmount = 2,
  ConfirmUnstake = 3
}

export const UnstakeModal = ({
  isOpen,
  onClose,
  stakedAmount,
  spendableBalance
}: UnstakeModal) => {
  const totalStep = 3

  const [unstakeAmount, setUnstakeAmount] = useState(0)
  const { currentStep, handleOneStepBack, handleOneStepForward } =
    useCurrentStep(onClose, totalStep)

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
            spendableBalance={spendableBalance}
            stakedAmount={stakedAmount}
            unstakeAmount={unstakeAmount}
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

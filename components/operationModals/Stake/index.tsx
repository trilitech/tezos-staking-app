import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex
} from '@chakra-ui/react'
import { StakeStart } from './StakeStart'
import { SelectAmount } from './SelectAmount'
import useCurrentStep from '@/utils/useCurrentStep'
import { Stepper } from '@/components/modalBody/Stepper'
import { BackIcon, CloseIcon } from '@/components/icons'

interface StakeModal {
  isOpen: boolean
  onClose: () => void
  spendableBalance: number
}

enum StakeStatus {
  StakeStart = 1,
  SelectAmount = 2
}

export const StakeModal = ({
  isOpen,
  onClose,
  spendableBalance
}: StakeModal) => {
  const [stakedAmount, setStakedAmount] = useState(0)
  const totalStep = 2

  const { currentStep, handleOneStepBack, handleOneStepForward, resetStep } =
    useCurrentStep(onClose, totalStep)

  const closeReset = () => {
    resetStep()
    setStakedAmount(0)
  }

  const getCurrentStepBody = (currentStep: number) => {
    switch (currentStep) {
      case StakeStatus.StakeStart:
        return <StakeStart handleOneStepForward={handleOneStepForward} />
      case StakeStatus.SelectAmount:
        return (
          <SelectAmount
            stakedAmount={stakedAmount}
            setStakedAmount={setStakedAmount}
            spendableBalance={spendableBalance}
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
          <Flex flexDir='column'>
            <Stepper totalStep={totalStep} currentStep={currentStep} />
            {getCurrentStepBody(currentStep)}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

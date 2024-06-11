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
import { StakeStart } from './StakeStart'
import { SelectAmount } from './SelectAmount'
import { ConfirmAmount } from './ConfirmAmount'
import useCurrentStep from '@/utils/useCurrentStep'

interface StakeModal {
  isOpen: boolean
  onClose: () => void
  spendableBalance: number
}

enum StakeStatus {
  StakeStart = 1,
  SelectAmount = 2,
  ConfirmStake = 3
}

export const StakeModal = ({
  isOpen,
  onClose,
  spendableBalance
}: StakeModal) => {
  const [stakedAmount, setStakedAmount] = useState(0)

  const { currentStep, handleOneStepBack, handleOneStepForward } =
    useCurrentStep(onClose, 3)

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
      case StakeStatus.ConfirmStake:
        return (
          <ConfirmAmount
            spendableBalance={spendableBalance}
            stakedAmount={stakedAmount as number}
            setStakedAmount={setStakedAmount}
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

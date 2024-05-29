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
import { SuccessBody } from '@/components/SuccessBody'

interface UnstakeModal {
  isOpen: boolean
  onClose: () => void
  stakedAmount: number
}

enum UnstakeStatus {
  UnstakeStart = 1,
  SelectAmount = 2,
  ConfirmUnstake = 3,
  UnstakeDone = 4
}

export const UnstakeModal = ({
  isOpen,
  onClose,
  stakedAmount
}: UnstakeModal) => {
  const [disableOnClick, setDisableOnClick] = useState(false)
  const [unstakeAmount, setUnstakeAmount] = useState<number>(0)
  const [tzktLink, setTzktLink] = useState('')
  const { currentStep, handleOneStepBack, handleOneStepForward, reset } =
    useCurrentStep(onClose, 4)

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
            setUnstakeAmount={setUnstakeAmount}
            setDisableOnClick={setDisableOnClick}
            handleOneStepForward={handleOneStepForward}
            setTzktLink={setTzktLink}
          />
        )
      case UnstakeStatus.UnstakeDone:
        return (
          <SuccessBody
            header='Nicely Done!'
            desc='You have successfully unstaked the funds. They will be available to finalize in 2 cycles (around 4 days).'
            buttonText='Continue'
            onClose={onClose}
            reset={reset}
            tzktLink={tzktLink}
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
          {currentStep !== UnstakeStatus.UnstakeDone && (
            <Flex justify='space-between' alignItems='center'>
              <Image
                onClick={() => {
                  if (!disableOnClick) handleOneStepBack()
                }}
                src='/images/FiArrowLeftCircle.svg'
                alt='back button'
                _hover={{ cursor: 'pointer' }}
              />
              <CloseIcon
                fontSize='14px'
                onClick={() => {
                  if (!disableOnClick) onClose()
                }}
                _hover={{ cursor: 'pointer' }}
              />
            </Flex>
          )}
        </ModalHeader>

        <ModalBody>
          <Flex flexDir='column'>
            {currentStep !== UnstakeStatus.UnstakeDone && (
              <Stepper currentStep={currentStep} />
            )}
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

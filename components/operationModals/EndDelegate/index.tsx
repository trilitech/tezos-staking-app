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
import useCurrentStep from '@/utils/useCurrentStep'
import { SuccessBody } from '@/components/SuccessBody'
import { EndDelegateStart } from './EndDelegateStart'
import { ConfirmEndDelegate } from './ConfirmEndDelegate'

interface EndDelegateModal {
  isOpen: boolean
  onClose: () => void
  bakerAddress: string
  spendableBalance: number
}

enum EndDelegateStatus {
  EndDelegationStart = 1,
  ConfirmEndBaker = 2,
  EndBakerDone = 3
}

export const EndDelegationModal = ({
  isOpen,
  onClose,
  bakerAddress,
  spendableBalance
}: EndDelegateModal) => {
  const { currentStep, handleOneStepBack, handleOneStepForward, reset } =
    useCurrentStep(onClose, 3)
  const [disableOnClick, setDisableOnClick] = useState(false)
  const [tzktLink, setTzktLink] = useState('')

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
            setDisableOnClick={setDisableOnClick}
            setTzktLink={setTzktLink}
          />
        )
      case EndDelegateStatus.EndBakerDone:
        return (
          <SuccessBody
            reset={reset}
            header='Delegation Ended!'
            desc='You have successfully ended the delegation. You can start a new delegation now.'
            buttonText='Continue'
            onClose={onClose}
            tzktLink={tzktLink}
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
      <ModalContent pb='20px'>
        <ModalHeader>
          {currentStep !== EndDelegateStatus.EndBakerDone && (
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
            {currentStep !== EndDelegateStatus.EndBakerDone && (
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
    </Flex>
  )
}

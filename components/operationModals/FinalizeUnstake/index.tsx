import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import useCurrentStep from '@/utils/useCurrentStep'
import { SuccessBody } from '@/components/SuccessBody'
import { ConfirmFinalizeUnstake } from './ConfirmFinalizeUnstake'

interface FinalizeUnstakeModal {
  withdrawAmount: number
  isOpen: boolean
  onClose: () => void
}

enum EndDelegateStatus {
  ConfirmFinalizeUnstake = 1,
  FinalizeUnstakeDone = 2
}

export const FinalizeUnstakeModal = ({
  withdrawAmount,
  isOpen,
  onClose
}: FinalizeUnstakeModal) => {
  const { currentStep, handleOneStepForward, reset } = useCurrentStep(
    onClose,
    2
  )
  const [disableOnClick, setDisableOnClick] = useState(false)
  const [tzktLink, setTzktLink] = useState('')

  const getCurrentStepBody = (currentStep: number) => {
    switch (currentStep) {
      case EndDelegateStatus.ConfirmFinalizeUnstake:
        return (
          <ConfirmFinalizeUnstake
            withdrawAmount={withdrawAmount}
            setDisableOnClick={setDisableOnClick}
            handleOneStepForward={handleOneStepForward}
            setTzktLink={setTzktLink}
          />
        )
      case EndDelegateStatus.FinalizeUnstakeDone:
        return (
          <SuccessBody
            header='Nicely Done!'
            desc='You have successfully finalized your unstake, the balance will appear under your available balance.'
            buttonText='Continue'
            onClose={onClose}
            reset={reset}
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
          <Flex justify='end'>
            <CloseIcon
              fontSize='14px'
              onClick={() => {
                if (!disableOnClick) onClose()
              }}
              _hover={{ cursor: 'pointer' }}
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

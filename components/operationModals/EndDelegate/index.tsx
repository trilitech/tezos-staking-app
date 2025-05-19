import React from 'react'
import { Dialog, Flex } from '@chakra-ui/react'
import useCurrentStep from '@/utils/useCurrentStep'
import { ConfirmEndDelegate } from './ConfirmEndDelegate'
import { BackIcon, CloseIcon } from '@/components/icons'
import { DisclaimerEndDelegate } from './DisclaimerEndDelegate'
import { Stepper } from '@/components/modalBody/Stepper'

interface EndDelegateModal {
  isStaked: boolean
  isOpen: boolean
  onClose: () => void
  bakerName: string
  spendableBalance: number
}

enum EndDelegateStatus {
  Disclamer = 1,
  EndDelegation = 2
}

export const EndDelegationModal = ({
  isStaked,
  isOpen,
  onClose,
  bakerName,
  spendableBalance
}: EndDelegateModal) => {
  const totalStep = isStaked ? 2 : 1

  const { currentStep, handleOneStepBack, handleOneStepForward, resetStep } =
    useCurrentStep(onClose, totalStep)

  const closeReset = () => {
    resetStep()
  }

  const getCurrentStepBody = (currentStep: number) => {
    if (isStaked && currentStep === EndDelegateStatus.Disclamer) {
      return (
        <DisclaimerEndDelegate handleOneStepForward={handleOneStepForward} />
      )
    }
    return (
      <ConfirmEndDelegate
        handleOneStepForward={handleOneStepForward}
        spendableBalance={spendableBalance}
        bakerName={bakerName}
      />
    )
  }

  return (
    <Dialog.Root
      placement='center'
      open={isOpen}
      closeOnInteractOutside={false}
    >
      <Dialog.Backdrop />
      <Dialog.Content>
        <Dialog.Header>
          <Flex justify='space-between' alignItems='center'>
            <Flex>
              <BackIcon
                display={currentStep > 1 ? 'block' : 'none'}
                onClick={handleOneStepBack}
              />
            </Flex>
            <CloseIcon
              onClick={() => {
                closeReset()
                onClose()
              }}
            />
          </Flex>
        </Dialog.Header>

        <Dialog.Body>
          {isStaked && totalStep === 2 && (
            <Stepper totalStep={totalStep} currentStep={currentStep} />
          )}
          <Flex flexDir='column'>{getCurrentStepBody(currentStep)}</Flex>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  )
}

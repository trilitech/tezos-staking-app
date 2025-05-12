import React from 'react'
import { Dialog, Flex } from '@chakra-ui/react'
import useCurrentStep from '@/utils/useCurrentStep'
import { ConfirmFinalizeUnstake } from './ConfirmFinalizeUnstake'
import { CloseIcon } from '@/components/icons'

interface FinalizeUnstakeModal {
  spendableBalance: number
  withdrawAmount: number
  isOpen: boolean
  onClose: () => void
}

enum EndDelegateStatus {
  ConfirmFinalizeUnstake = 1
}

export const FinalizeUnstakeModal = ({
  spendableBalance,
  withdrawAmount,
  isOpen,
  onClose
}: FinalizeUnstakeModal) => {
  const { currentStep, handleOneStepForward, resetStep } = useCurrentStep(
    onClose,
    1
  )

  const closeReset = () => {
    resetStep()
  }

  const getCurrentStepBody = (currentStep: number) => {
    switch (currentStep) {
      case EndDelegateStatus.ConfirmFinalizeUnstake:
        return (
          <ConfirmFinalizeUnstake
            spendableBalance={spendableBalance}
            withdrawAmount={withdrawAmount}
            handleOneStepForward={handleOneStepForward}
          />
        )
      default:
        console.error('End delegation step is not defined')
        return
    }
  }

  return (
    <Dialog.Root
      placement='center'
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <Dialog.Backdrop />
      <Dialog.Content>
        <Dialog.Header>
          <Flex justify='end'>
            <CloseIcon
              onClick={() => {
                closeReset()
                onClose()
              }}
            />
          </Flex>
        </Dialog.Header>

        <Dialog.Body>
          <Flex flexDir='column'>{getCurrentStepBody(currentStep)}</Flex>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  )
}

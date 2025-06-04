import React, { useState } from 'react'
import { Dialog, Flex } from '@chakra-ui/react'
import { UnstakeStart } from './UnstakeStart'
import { SelectAmount } from './SelectAmount'
import useCurrentStep from '@/utils/useCurrentStep'
import { Stepper } from '@/components/modalBody/Stepper'
import { BackIcon, CloseIcon } from '@/components/icons'

interface UnstakeModal {
  isOpen: boolean
  onClose: () => void
  stakedAmount: number
}

enum UnstakeStatus {
  UnstakeStart = 1,
  SelectAmount = 2
}

export const UnstakeModal = ({
  isOpen,
  onClose,
  stakedAmount
}: UnstakeModal) => {
  const totalStep = 2

  const [unstakeAmount, setUnstakeAmount] = useState(0)
  const { currentStep, handleOneStepBack, handleOneStepForward, resetStep } =
    useCurrentStep(onClose, totalStep)

  const closeReset = () => {
    resetStep()
    setUnstakeAmount(0)
  }

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
      default:
        console.error('Delegation step is not defined')
        return
    }
  }

  return (
    <Dialog.Root
      placement='center'
      open={isOpen}
      closeOnInteractOutside={false}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Flex justify='space-between' alignItems='center' w='full'>
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
            <Flex flexDir='column'>
              <Stepper totalStep={totalStep} currentStep={currentStep} />
              {getCurrentStepBody(currentStep)}
            </Flex>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

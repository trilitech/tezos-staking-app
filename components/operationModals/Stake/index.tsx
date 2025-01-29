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
import { ChooseBaker } from '../Delegate/ChooseBaker'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { ConfirmBaker } from '../Delegate/ConfirmBaker'
import { DisclaimerStaking } from './DisclaimerStaking'

interface StakeModal {
  isOpen: boolean
  onClose: () => void
  spendableBalance: number
  bakerList: BakerInfo[] | null
}

enum StakeStatus {
  StakeStart = 1,
  ChooseBaker = 2,
  ConfirmBaker = 3,
  SelectAmount = 4,
  DisclaimerStaking = 5
}

export const StakeModal = ({
  isOpen,
  onClose,
  spendableBalance,
  bakerList
}: StakeModal) => {
  const [stakedAmount, setStakedAmount] = useState(0)
  const [selectedBaker, setSelectedBaker] = useState<BakerInfo | null>(null)

  const totalStep = 5

  const { currentStep, handleOneStepBack, handleOneStepForward, resetStep } =
    useCurrentStep(onClose, totalStep)

  const closeReset = () => {
    resetStep()
    setStakedAmount(0)
    setSelectedBaker(null)
  }

  const getCurrentStepBody = (currentStep: number) => {
    switch (currentStep) {
      case StakeStatus.StakeStart:
        return <StakeStart handleOneStepForward={handleOneStepForward} />
      case StakeStatus.ChooseBaker:
        return (
          <ChooseBaker
            handleOneStepForward={handleOneStepForward}
            setSelectedBaker={setSelectedBaker}
            bakerList={bakerList ?? []}
          />
        )
      case StakeStatus.ConfirmBaker:
        return (
          <ConfirmBaker
            handleOneStepForward={handleOneStepForward}
            handleOneStepBack={handleOneStepBack}
            selectedBaker={selectedBaker as BakerInfo}
            setSelectedBaker={setSelectedBaker}
          />
        )
      case StakeStatus.SelectAmount:
        return (
          <SelectAmount
            stakedAmount={stakedAmount}
            setStakedAmount={setStakedAmount}
            spendableBalance={spendableBalance}
            handleOneStepForward={handleOneStepForward}
          />
        )
      case StakeStatus.DisclaimerStaking:
        return (
          <DisclaimerStaking
            stakedAmount={stakedAmount}
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

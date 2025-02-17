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
  openedFromStartEarning: boolean
  currentBakerAddress: string | undefined
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
  openedFromStartEarning,
  onClose,
  spendableBalance,
  bakerList,
  currentBakerAddress
}: StakeModal) => {
  const [stakedAmount, setStakedAmount] = useState(0)
  const [selectedBaker, setSelectedBaker] = useState<BakerInfo | null>(null)

  const firstStep = openedFromStartEarning
    ? StakeStatus.StakeStart
    : StakeStatus.SelectAmount

  const totalStep = openedFromStartEarning ? 5 : 2

  const { currentStep, handleOneStepBack, handleOneStepForward, resetStep } =
    useCurrentStep(onClose, totalStep)

  const closeReset = () => {
    resetStep()
    setStakedAmount(0)
    setSelectedBaker(null)
  }

  const bigModal = currentStep === StakeStatus.ChooseBaker

  const getCurrentStepBody = (currentStep: number) => {
    switch (currentStep) {
      case StakeStatus.StakeStart:
        return openedFromStartEarning ? (
          <StakeStart handleOneStepForward={handleOneStepForward} />
        ) : null
      case StakeStatus.ChooseBaker:
        return openedFromStartEarning ? (
          <ChooseBaker
            handleOneStepForward={handleOneStepForward}
            setSelectedBaker={setSelectedBaker}
            bakerList={bakerList ?? []}
            currentBakerAddress={currentBakerAddress}
          />
        ) : null
      case StakeStatus.ConfirmBaker:
        return openedFromStartEarning ? (
          <ConfirmBaker
            handleOneStepForward={handleOneStepForward}
            handleOneStepBack={handleOneStepBack}
            selectedBaker={selectedBaker as BakerInfo}
            openedFromStartEarning={openedFromStartEarning}
            setSelectedBaker={setSelectedBaker}
          />
        ) : null
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
            setStakedAmount={setStakedAmount}
            stakedAmount={stakedAmount}
            openedFromStartEarning={openedFromStartEarning}
            handleOneStepForward={handleOneStepForward}
          />
        )
      default:
        console.error('Delegation step is not defined')
        return null
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
      <ModalContent w={['100%', bigModal ? '540px' : '480px']} >
        <ModalHeader>
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
        </ModalHeader>

        <ModalBody>
          <Flex flexDir='column'>
            <Stepper totalStep={totalStep} currentStep={currentStep} />
            {getCurrentStepBody(
              firstStep === StakeStatus.SelectAmount
                ? currentStep + 3
                : currentStep
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

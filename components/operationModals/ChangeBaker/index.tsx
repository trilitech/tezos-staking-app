import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex
} from '@chakra-ui/react'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { ChangeStart } from './ChangeStart'
import { ChooseBaker } from '../Delegate/ChooseBaker'
import useCurrentStep from '@/utils/useCurrentStep'
import { Stepper } from '@/components/modalBody/Stepper'
import { BackIcon, CloseIcon } from '@/components/icons'
import { DelegateModalProps } from '@/components/operationModals/Delegate'
import { ConfirmBaker } from '../Delegate/ConfirmBaker'

interface ChangeBakerModalProps extends DelegateModalProps {
  isStaked: boolean
}

enum UnStakedDelegateStatus {
  ChooseBaker = 1,
  ChangeConfirm = 2
}

enum StakedDelegateStatus {
  ChangeStart = 1,
  ChooseBaker = 2,
  ChangeConfirm = 3
}

export const ChangeBakerModal = ({
  isOpen,
  onClose,
  bakerList,
  isStaked
}: ChangeBakerModalProps) => {
  const [selectedBaker, setSelectedBaker] = useState<BakerInfo | null>(null)
  const totalStep = isStaked ? 3 : 2

  const { currentStep, handleOneStepBack, handleOneStepForward, resetStep } =
    useCurrentStep(onClose, totalStep)

  const closeReset = () => {
    resetStep()
    setSelectedBaker(null)
  }

  const getCurrentStepBody = (currentStep: number, isStaked: boolean) => {
    if (isStaked) {
      switch (currentStep) {
        case StakedDelegateStatus.ChangeStart:
          return <ChangeStart handleOneStepForward={handleOneStepForward} />
        case StakedDelegateStatus.ChooseBaker:
          return (
            <ChooseBaker
              handleOneStepForward={handleOneStepForward}
              setSelectedBaker={setSelectedBaker}
              bakerList={bakerList ?? []}
            />
          )
        case StakedDelegateStatus.ChangeConfirm:
          return (
            <ConfirmBaker
              openedFromStartEarning={false}
              handleOneStepForward={handleOneStepForward}
              handleOneStepBack={handleOneStepBack}
              selectedBaker={selectedBaker as BakerInfo}
              setSelectedBaker={setSelectedBaker}
              isChangeBaker={true}
            />
          )
        default:
          console.error('Delegation step is not defined')
          return
      }
    }

    switch (currentStep) {
      case UnStakedDelegateStatus.ChooseBaker:
        return (
          <ChooseBaker
            handleOneStepForward={handleOneStepForward}
            setSelectedBaker={setSelectedBaker}
            bakerList={bakerList ?? []}
          />
        )
      case UnStakedDelegateStatus.ChangeConfirm:
        return (
          <ConfirmBaker
            openedFromStartEarning={false}
            handleOneStepForward={handleOneStepForward}
            handleOneStepBack={handleOneStepBack}
            selectedBaker={selectedBaker as BakerInfo}
            setSelectedBaker={setSelectedBaker}
            isChangeBaker={true}
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
            <BackIcon
              onClick={() => {
                if (isStaked && currentStep === 3) setSelectedBaker(null)
                else if (!isStaked && currentStep === 2) setSelectedBaker(null)
                handleOneStepBack()
              }}
            />
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
            {getCurrentStepBody(currentStep, isStaked)}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

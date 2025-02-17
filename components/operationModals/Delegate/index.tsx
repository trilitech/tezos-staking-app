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
import { DelegateStart } from './DelegateStart'
import { ChooseBaker } from './ChooseBaker'
import useCurrentStep from '@/utils/useCurrentStep'
import { Stepper } from '@/components/modalBody/Stepper'
import { BackIcon, CloseIcon } from '@/components/icons'
import { ConfirmBaker } from './ConfirmBaker'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

export interface DelegateModalProps {
  isOpen: boolean
  onClose: () => void
  bakerList: BakerInfo[] | null
  currentBakerAddress: string | undefined
}

enum DelegateStatus {
  DelegationStart = 1,
  ChooseBaker = 2,
  DelegationConfirm = 3
}

const bakersListApiUrl = `${process.env.NEXT_PUBLIC_TZKT_API_URL}/v1/delegates?active=true&limit=1000`
export async function getBakerList() {
  const response = await fetch(bakersListApiUrl)
  if (!response.ok) {
    console.error('Failed to fetch baker list')
    return null
  }
  return response.json()
}

export const DelegationModal = ({
  isOpen,
  onClose,
  bakerList,
  currentBakerAddress
}: DelegateModalProps) => {
  const [selectedBaker, setSelectedBaker] = useState<BakerInfo | null>(null)
  const totalStep = 3

  const { currentStep, handleOneStepBack, handleOneStepForward, resetStep } =
    useCurrentStep(onClose, totalStep)

  const closeReset = () => {
    resetStep()
    setSelectedBaker(null)
  }
  const bigModal = currentStep === DelegateStatus.ChooseBaker

  const getCurrentStepBody = (currentStep: number) => {
    switch (currentStep) {
      case DelegateStatus.DelegationStart:
        return <DelegateStart handleOneStepForward={handleOneStepForward} />
      case DelegateStatus.ChooseBaker:
        return (
          <ChooseBaker
            handleOneStepForward={handleOneStepForward}
            setSelectedBaker={setSelectedBaker}
            bakerList={bakerList ?? []}
            currentBakerAddress={currentBakerAddress}
          />
        )
      case DelegateStatus.DelegationConfirm:
        return (
          <ConfirmBaker
            openedFromStartEarning={false}
            handleOneStepForward={handleOneStepForward}
            handleOneStepBack={handleOneStepBack}
            selectedBaker={selectedBaker as BakerInfo}
            setSelectedBaker={setSelectedBaker}
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
      <ModalContent w={['100%', bigModal ? '540px' : '480px']}>
        <ModalHeader>
          <Flex justify='space-between' alignItems='center'>
            <Flex>
              <BackIcon
                display={currentStep > 1 ? 'block' : 'none'}
                onClick={() => {
                  if (currentStep === 3) setSelectedBaker(null)
                  handleOneStepBack()
                }}
              />
            </Flex>
            <CloseIcon
              onClick={() => {
                trackGAEvent(
                  GAAction.BUTTON_CLICK,
                  GACategory.CHOOSE_BAKER_CLOSED
                )
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

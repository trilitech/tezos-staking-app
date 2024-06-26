import React, { useState, useEffect } from 'react'
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
import { useQuery } from '@tanstack/react-query'
import useCurrentStep from '@/utils/useCurrentStep'
import { Stepper } from '@/components/modalBody/Stepper'
import { BackIcon, CloseIcon } from '@/components/icons'
import { mutezToTez } from '@/utils/mutezToTez'

interface DelegateModal {
  isOpen: boolean
  onClose: () => void
}

enum DelegateStatus {
  DelegationStart = 1,
  ChooseBaker = 2
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

export const DelegationModal = ({ isOpen, onClose }: DelegateModal) => {
  const [bakerList, setBakerList] = useState<BakerInfo[] | null>(null)
  const [selectedBaker, setSelectedBaker] = useState<BakerInfo | null>(null)
  const [showStepper, setShowStepper] = useState(true)
  const totalStep = 2

  const { data, status } = useQuery({
    queryKey: ['bakerList'],
    queryFn: getBakerList,
    staleTime: 180000
  })

  useEffect(() => {
    if (status === 'success') {
      const bakerData = data?.map((baker: BakerInfo) => {
        return {
          alias: baker.alias ?? 'Private Baker',
          address: baker.address,
          acceptsStaking: mutezToTez(baker.limitOfStakingOverBaking) > 0,
          stakingFees: baker.edgeOfBakingOverStaking / 10000000,
          stakingFreeSpace: mutezToTez(
            baker.stakedBalance * mutezToTez(baker.limitOfStakingOverBaking) -
              baker.externalStakedBalance
          )
        }
      })

      setBakerList(bakerData)
    } else if (status === 'error') {
      throw Error('Fail to get the baker list')
    }
  }, [status])

  const { currentStep, handleOneStepBack, handleOneStepForward, resetStep } =
    useCurrentStep(onClose, totalStep)

  const closeReset = () => {
    resetStep()
    setSelectedBaker(null)
    setShowStepper(true)
  }

  const getCurrentStepBody = (currentStep: number) => {
    switch (currentStep) {
      case DelegateStatus.DelegationStart:
        return <DelegateStart handleOneStepForward={handleOneStepForward} />
      case DelegateStatus.ChooseBaker:
        return (
          <ChooseBaker
            handleOneStepForward={handleOneStepForward}
            selectedBaker={selectedBaker}
            setSelectedBaker={setSelectedBaker}
            bakerList={bakerList ?? []}
            setShowStepper={setShowStepper}
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
            {showStepper && (
              <Stepper totalStep={totalStep} currentStep={currentStep} />
            )}

            {getCurrentStepBody(currentStep)}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Image,
  Flex
} from '@chakra-ui/react'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { CloseIcon } from '@chakra-ui/icons'
import { DelegateStart } from './DelegateStart'
import { ChooseBaker } from './ChooseBaker'
import { useQuery } from '@tanstack/react-query'
import useCurrentStep from '@/utils/useCurrentStep'
import { ConfirmDelegate } from './ConfirmDelegate'
import { GetFees } from '@/components/Operations/operations'

interface DelegateModal {
  isOpen: boolean
  onClose: () => void
  spendableBalance: number
}

enum DelegateStatus {
  DelegationStart = 1,
  ChooseBaker = 2,
  ConfirmBaker = 3
}

async function getBakerList() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TZKT_API_URL}/v1/delegates?active=true`
  )
  if (!response.ok) {
    console.error('Failed to fetch baker list')
    return null
  }
  return response.json()
}

export const DelegationModal = ({
  isOpen,
  onClose,
  spendableBalance
}: DelegateModal) => {
  const [bakerList, setBakerList] = useState<BakerInfo[] | null>(null)
  const [selectedBaker, setSelectedBaker] = useState<BakerInfo | null>(null)

  const { data, status } = useQuery({
    queryKey: ['baerList'],
    queryFn: getBakerList,
    staleTime: 180000
  })

  useEffect(() => {
    if (status === 'success') {
      const bakerData = data.map((baker: BakerInfo) => {
        return {
          address: baker.address
        }
      })

      setBakerList(bakerData)
    } else if (status === 'error') {
      throw Error('Fail to get the baker list')
    }
  }, [status])

  const { currentStep, handleOneStepBack, handleOneStepForward } =
    useCurrentStep(onClose, 3)

  const getCurrentStepBody = (currentStep: number) => {
    switch (currentStep) {
      case DelegateStatus.DelegationStart:
        return <DelegateStart handleOneStepForward={handleOneStepForward} />
      case DelegateStatus.ChooseBaker:
        return (
          <ChooseBaker
            spendableBalance={spendableBalance}
            handleOneStepForward={handleOneStepForward}
            selectedBaker={selectedBaker}
            setSelectedBaker={setSelectedBaker}
            bakerList={bakerList ?? []}
          />
        )
      case DelegateStatus.ConfirmBaker:
        return (
          <ConfirmDelegate
            handleOneStepForward={handleOneStepForward}
            selectedBaker={selectedBaker as BakerInfo}
            spendableBalance={spendableBalance}
            opFees={GetFees('delegate', spendableBalance)}
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
      <ModalContent pb='20px'>
        <ModalHeader>
          <Flex justify='space-between' alignItems='center'>
            <Image
              onClick={handleOneStepBack}
              src='/images/FiArrowLeftCircle.svg'
              alt='back button'
              _hover={{ cursor: 'pointer' }}
            />
            <CloseIcon
              fontSize='14px'
              onClick={onClose}
              _hover={{ cursor: 'pointer' }}
            />
          </Flex>
        </ModalHeader>

        <ModalBody>
          <Flex flexDir='column'>
            <Stepper currentStep={currentStep} />
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
      <Image pr='5px' src='/images/stepper/line.svg' alt='dot' />
      {currentStep === 3 ? (
        <Image src='/images/stepper/full-dot.svg' alt='dot' />
      ) : (
        <Image src='/images/stepper/empty-dot.svg' alt='dot' />
      )}
    </Flex>
  )
}

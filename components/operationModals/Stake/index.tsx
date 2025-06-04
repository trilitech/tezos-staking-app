import React, { useRef, useState } from 'react'
import { Dialog, Flex } from '@chakra-ui/react'
import { StakeStart } from './StakeStart'
import { SelectAmount } from './SelectAmount'
import useCurrentStep from '@/utils/useCurrentStep'
import { Stepper } from '@/components/modalBody/Stepper'
import { BackIcon, CloseIcon } from '@/components/icons'
import { ChooseBaker } from '../Delegate/ChooseBaker'
import {
  BakerInfo,
  StakingOpsStatus
} from '@/components/Operations/tezInterfaces'
import { ConfirmBaker } from '../Delegate/ConfirmBaker'
import { DisclaimerStaking } from './DisclaimerStaking'

interface StakeModal {
  isOpen: boolean
  onClose: () => void
  spendableBalance: number
  bakerList: BakerInfo[] | null
  openedFromStartEarning: boolean
  currentBakerAddress: string | undefined
  stakingOpsStatus?: StakingOpsStatus
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
  currentBakerAddress,
  stakingOpsStatus
}: StakeModal) => {
  const [stakedAmount, setStakedAmount] = useState(0)
  const [selectedBaker, setSelectedBaker] = useState<BakerInfo | null>(null)
  const inputRef = useRef<HTMLInputElement>(null!)

  const firstStep = openedFromStartEarning
    ? StakeStatus.StakeStart
    : StakeStatus.SelectAmount

  const totalStep = openedFromStartEarning ? 5 : 2

  const {
    currentStep,
    handleOneStepBack,
    handleOneStepForward,
    resetStep,
    handleNStepForward
  } = useCurrentStep(onClose, totalStep)

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
            handleNStepForward={handleNStepForward}
            selectedBaker={selectedBaker as BakerInfo}
            openedFromStartEarning={openedFromStartEarning}
            setSelectedBaker={setSelectedBaker}
            canStake={!stakingOpsStatus?.pendingUnstakeOpsWithAnotherBaker}
          />
        ) : null
      case StakeStatus.SelectAmount:
        return (
          <SelectAmount
            stakedAmount={stakedAmount}
            setStakedAmount={setStakedAmount}
            spendableBalance={spendableBalance}
            handleOneStepForward={handleOneStepForward}
            inputRef={inputRef}
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
    <Dialog.Root
      placement='center'
      open={isOpen}
      closeOnInteractOutside={false}
      // initialFocusEl={inputRef}
      // autoFocus={!bigModal}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content w={['100%', bigModal ? '540px' : '480px']}>
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
              {getCurrentStepBody(
                firstStep === StakeStatus.SelectAmount
                  ? currentStep + 3
                  : currentStep
              )}
            </Flex>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

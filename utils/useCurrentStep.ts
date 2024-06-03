import { useState } from 'react'

const useCurrentStep = (onClose: () => void, totalSteps: number) => {
  const [currentStep, setCurrentStep] = useState(1)

  const handleOneStepBack = () => {
    if (currentStep === 1) {
      onClose()
    } else {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleOneStepForward = () => {
    setCurrentStep(prev => prev + 1)

    if (currentStep >= totalSteps) {
      setCurrentStep(1)
      onClose()
    }
  }

  return {
    currentStep,
    handleOneStepBack,
    handleOneStepForward
  }
}

export default useCurrentStep

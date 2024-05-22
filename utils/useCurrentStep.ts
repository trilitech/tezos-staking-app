import { useState } from 'react'

const useCurrentStep = (onClose: () => void, totalSteps: number) => {
  const [currentStep, setCurrentStep] = useState<number>(1)

  const handleOneStepBack = () => {
    if (currentStep === 1) {
      onClose()
    } else {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleOneStepForward = () => {
    if (currentStep === totalSteps) return
    else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const reset = () => setCurrentStep(1)

  return {
    currentStep,
    handleOneStepBack,
    handleOneStepForward,
    reset
  }
}

export default useCurrentStep

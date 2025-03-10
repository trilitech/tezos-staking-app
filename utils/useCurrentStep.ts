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

  const handleNStepForward = (n: number) => {
    setCurrentStep(prev => {
      const newStep = prev + n
      if (newStep >= totalSteps) {
        onClose()

        return 1
      }
      return newStep
    })
  }

  const resetStep = () => setCurrentStep(1)

  return {
    currentStep,
    handleOneStepBack,
    handleOneStepForward,
    handleNStepForward,
    resetStep
  }
}

export default useCurrentStep

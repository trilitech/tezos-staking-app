import React, { createContext, useContext, useState } from 'react'

interface OperationResponseContextType {
  success: boolean
  setSuccess: (arg: boolean) => void
  error: boolean
  setError: (arg: boolean) => void
  opHash?: string
  setOpHash: (arg?: string) => void
  message: string
  setMessage: (message: string) => void
  resetOperation: () => void
}

const OperationResponseContext = createContext<
  OperationResponseContextType | undefined
>(undefined)

export const useOperationResponse = (): OperationResponseContextType => {
  const context = useContext(OperationResponseContext)
  if (!context) {
    throw new Error(
      'useOperationError must be used within an OperationErrorProvider'
    )
  }
  return context
}

export const OperationResponseProvider = ({ children }: { children: any }) => {
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [opHash, setOpHash] = useState<string | undefined>(undefined)

  const resetOperation = () => {
    setMessage('')
    setSuccess(false)
    setError(false)
    setOpHash(undefined)
  }

  return (
    <OperationResponseContext.Provider
      value={{
        success,
        setSuccess,
        error,
        setError,
        opHash,
        setOpHash,
        message,
        setMessage,
        resetOperation
      }}
    >
      {children}
    </OperationResponseContext.Provider>
  )
}

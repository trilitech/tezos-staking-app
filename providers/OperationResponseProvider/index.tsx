import React, { createContext, useContext, useState } from 'react'

export type OpType =
  | 'delegate'
  | 'end_delegate'
  | 'change_baker'
  | 'stake'
  | 'unstake'
  | 'finalize_unstake'

interface OperationResponseContextType {
  success: boolean
  setSuccess: (arg: boolean) => void
  amount: number
  setAmount: (arg: number) => void
  opHash?: string
  setOpHash: (arg?: string) => void
  title?: string
  setTitle: (title: string) => void
  message: string
  setMessage: (message: string) => void
  resetOperation: () => void
  opType: OpType | undefined
  setOpType: (arg: OpType) => void
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
  const [title, setTitle] = useState('')
  const [success, setSuccess] = useState(false)
  const [amount, setAmount] = useState(0)
  const [opHash, setOpHash] = useState<string | undefined>(undefined)
  const [opType, setOpType] = useState<OpType | undefined>(undefined)

  const resetOperation = () => {
    setMessage('')
    setTitle('')
    setSuccess(false)
    setAmount(0)
    setOpHash(undefined)
    setOpType(undefined)
  }

  return (
    <OperationResponseContext.Provider
      value={{
        success,
        setSuccess,
        amount,
        setAmount,
        opHash,
        setOpHash,
        title,
        setTitle,
        message,
        setMessage,
        resetOperation,
        opType,
        setOpType
      }}
    >
      {children}
    </OperationResponseContext.Provider>
  )
}

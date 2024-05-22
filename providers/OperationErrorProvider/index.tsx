import React, { createContext, useContext, useState } from 'react'

interface OperationErrorContextType {
  operationErrorMessage: string | undefined
  setoOerationErrorMessage: (error: string | undefined) => void
}

const OperationErrorContext = createContext<
  OperationErrorContextType | undefined
>(undefined)

export const useOperationError = (): OperationErrorContextType => {
  const context = useContext(OperationErrorContext)
  if (!context) {
    throw new Error(
      'useOperationError must be used within an OperationErrorProvider'
    )
  }
  return context
}

export const OperationErrorProvider = ({ children }: { children: any }) => {
  const [operationErrorMessage, setoOerationErrorMessage] = useState<
    string | undefined
  >(undefined)

  return (
    <OperationErrorContext.Provider
      value={{ operationErrorMessage, setoOerationErrorMessage }}
    >
      {children}
    </OperationErrorContext.Provider>
  )
}

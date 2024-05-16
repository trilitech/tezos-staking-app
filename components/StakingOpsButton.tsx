import React from 'react'
import { Button } from '@chakra-ui/react'
import { TezosToolkit } from '@taquito/taquito'

interface StakingOpsButtonProps {
  Tezos: TezosToolkit | undefined
  setOpResult: any
  operation: (Tezos: TezosToolkit, ...args: any[]) => Promise<any>
  operationArgs: any[]
  buttonName: string
}

export const StakingOpsButton: React.FC<StakingOpsButtonProps> = ({
  Tezos,
  setOpResult,
  operation,
  operationArgs,
  buttonName
}) => {
  return (
    <Button
      onClick={async () => {
        if (Tezos instanceof TezosToolkit) {
          const response = await operation(Tezos, ...operationArgs)
          setOpResult(response)
        }
      }}
    >
      {buttonName}
    </Button>
  )
}

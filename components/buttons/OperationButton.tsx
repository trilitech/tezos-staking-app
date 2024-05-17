import React from 'react'
import { Button, ButtonProps } from '@chakra-ui/react'
import { TezosToolkit } from '@taquito/taquito'

interface StakingOpsButtonProps {
  Tezos: TezosToolkit | undefined
  setOpResult: any
  operation: (Tezos: TezosToolkit, ...args: any[]) => Promise<any>
  operationArgs: any[]
  children: React.ReactNode
}

export const OperationButton: React.FC<StakingOpsButtonProps & ButtonProps> = ({
  Tezos,
  setOpResult,
  operation,
  operationArgs,
  children,
  ...styles
}) => {
  return (
    <Button
      px='24px'
      bg='#0052FF'
      color='white'
      borderRadius='10px'
      onClick={async () => {
        if (Tezos instanceof TezosToolkit) {
          const response = await operation(Tezos, ...operationArgs)
          setOpResult(response)
        }
      }}
      _hover={{
        bg: '#0052FF'
      }}
      {...styles}
    >
      {children}
    </Button>
  )
}

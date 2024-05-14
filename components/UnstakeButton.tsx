import React from 'react'
import { Button } from '@chakra-ui/react'
// @ts-ignore
import { unstake } from './Operations/operations.ts'
import { TezosToolkit } from '@taquito/taquito'

export const UnstakeButton = ({
  amount,
  Tezos,
  setOpResult
}: {
  amount: number
  Tezos: TezosToolkit | undefined
  setOpResult: any
}) => {
  return (
    <Button
      onClick={() => {
        if (Tezos instanceof TezosToolkit) {
          const response = unstake(amount, Tezos)
          setOpResult(response.then(value => value))
        }
      }}
    >
      Unstake
    </Button>
  )
}

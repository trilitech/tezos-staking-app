import React from 'react'
import { Button } from '@chakra-ui/react'
// @ts-ignore
import { stake } from './Operations/operations.ts'
import { TezosToolkit } from '@taquito/taquito'

export const StakeButton = ({
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
          const response = stake(amount, Tezos)
          setOpResult(response.then(value => value))
        }
      }}
    >
      Stake
    </Button>
  )
}

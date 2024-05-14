import React from 'react'
import { Button } from '@chakra-ui/react'
// @ts-ignore
import { finalizeUnstake } from './Operations/operations.ts'
import { TezosToolkit } from '@taquito/taquito'

export const FinalizeUnstakeButton = ({
  Tezos,
  setOpResult
}: {
  Tezos: TezosToolkit | undefined
  setOpResult: any
}) => {
  return (
    <Button
      onClick={() => {
        if (Tezos instanceof TezosToolkit) {
          const response = finalizeUnstake(Tezos)
          setOpResult(response.then(value => value))
        }
      }}
    >
      Finalize-Unstake
    </Button>
  )
}

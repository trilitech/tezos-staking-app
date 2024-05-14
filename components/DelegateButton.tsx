import React from 'react'
import { Button } from '@chakra-ui/react'
// @ts-ignore
import { setDelegate } from './Operations/operations.ts'
import { TezosToolkit } from '@taquito/taquito'

export const DelegateButton = ({
  delegateId,
  Tezos,
  setOpResult
}: {
  delegateId: string
  Tezos: TezosToolkit | undefined
  setOpResult: any
}) => {
  return (
    <Button
      onClick={() => {
        if (Tezos instanceof TezosToolkit) {
          const response = setDelegate(delegateId, Tezos)
          setOpResult(response.then(value => value))
        }
      }}
    >
      Delegate
    </Button>
  )
}

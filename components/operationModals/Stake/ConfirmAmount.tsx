import React, { useState } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import {
  stake,
  getFee,
  OperationType
} from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { TezosToolkit } from '@taquito/taquito'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'
import { useQuery } from '@tanstack/react-query'

interface ConfirmAmountProps {
  spendableBalance: number
  stakedAmount: number
  setStakedAmount: (arg: number) => void
  handleOneStepForward: () => void
}

export const ConfirmAmount = ({
  spendableBalance,
  stakedAmount,
  setStakedAmount,
  handleOneStepForward
}: ConfirmAmountProps) => {
  const { Tezos, address } = useConnection()
  const { setMessage, setSuccess, setOpHash } = useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)

  const { data, status: gasFeeStatus } = useQuery({
    queryKey: ['stakeFee'],
    queryFn: () => getFee(OperationType.Stake, Tezos, address, stakedAmount),
    staleTime: 180000
  })

  return (
    <Flex flexDir='column'>
      <Header mb='24px'>Confirm</Header>
      <ColumnHeader mb='12px'>SPENDABLE BALANCE</ColumnHeader>
      <BalanceBox
        mb='12px'
        gasFeeStatus={gasFeeStatus}
        fee={data?.gasFee}
        balance={spendableBalance}
      />
      <ColumnHeader mb='12px'>STAKE AMOUNT</ColumnHeader>
      <BalanceBox mb='30px' balance={stakedAmount} />
      <PrimaryButton
        onClick={async () => {
          setWaitingOperation(true)
          const response = await stake(Tezos as TezosToolkit, stakedAmount)
          setWaitingOperation(false)

          if (response.success) {
            setOpHash(response.opHash)
            setMessage(`You have successfully staked ${stakedAmount} ꜩ`)
            setSuccess(true)
            setStakedAmount(0)
            handleOneStepForward()
          } else {
            setErrorMessage(response.message)
          }
        }}
      >
        {waitingOperation ? <Spinner /> : 'Confirm'}
      </PrimaryButton>
      {!!errorMessage && <ErrorBlock errorMessage={errorMessage} />}
    </Flex>
  )
}

import React, { useEffect, useState } from 'react'
import { Flex } from '@chakra-ui/react'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { GetFees, stake } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { TezosToolkit } from '@taquito/taquito'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { useQuery } from '@tanstack/react-query'

interface ConfirmAmountProps {
  spendableBalance: number
  stakedAmount: number
  setStakedAmount: (arg: number) => void
  handleOneStepForward: () => void
}
let amount = 0
async function getStakeFees() {
  const response = await GetFees('stake', amount)
  if (!response) {
    console.error('Failed to fetch baker list')
    return null
  }
  return response
}

export const ConfirmAmount = ({
  spendableBalance,
  stakedAmount,
  setStakedAmount,
  handleOneStepForward
}: ConfirmAmountProps) => {
  amount = stakedAmount
  const { Tezos } = useConnection()
  const { setMessage, setSuccess, setOpHash, setError } = useOperationResponse()
  const [opFees, setOpFees] = useState<number>(0)

  const { data, status } = useQuery({
    queryKey: ['stakeFees'],
    queryFn: getStakeFees,
    staleTime: 180000
  })
  // create a useEffect which uses useQuery to get fees and status of query. Just like in ChangeBaker/index.tsx
  useEffect(() => {
    if (status === 'success') {
      setOpFees(data ?? 0)
    } else if (status === 'error') {
      throw Error('Fail to get the fees')
    }
  }, [status])

  return (
    <Flex flexDir='column'>
      <Header my='24px'>Confirm</Header>
      <ColumnHeader mb='12px'>AVAILABLE</ColumnHeader>
      <BalanceBox balance={spendableBalance - stakedAmount} />
      <ColumnHeader mb='12px'>STAKE AMOUNT</ColumnHeader>
      <BalanceBox balance={stakedAmount} />
      <ColumnHeader mb='12px'>Fees </ColumnHeader>
      <BalanceBox balance={opFees} />
      <PrimaryButton
        onClick={async () => {
          const response = await stake(Tezos as TezosToolkit, stakedAmount)

          if (response.success) {
            setOpHash(response.opHash)
            setMessage(
              'You have successfully staked your balance to the baker.'
            )
            setSuccess(true)
            setStakedAmount(0)
            handleOneStepForward()
          } else {
            setMessage(response.message)
            setError(true)
          }
        }}
      >
        Confirm
      </PrimaryButton>
    </Flex>
  )
}

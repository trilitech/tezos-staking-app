import React, { useState } from 'react'
import { Flex, InputGroup, Input, Image, Text, Spinner } from '@chakra-ui/react'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { stake } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

export const SelectAmount = ({
  spendableBalance,
  handleOneStepForward,
  setStakedAmount,
  stakedAmount
}: {
  spendableBalance: number
  handleOneStepForward: () => void
  setStakedAmount: (arg: number) => void
  stakedAmount: number
}) => {
  const { Tezos, beaconWallet } = useConnection()
  const { setMessage, setSuccess, setOpHash, setOpType } =
    useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)

  const handleChange = (event: any) => {
    const val = Number(event.target.value)
    trackGAEvent(GAAction.BUTTON_CLICK, GACategory.INPUT_AMOUNT)

    if (val <= spendableBalance) setStakedAmount(val)
    else if (val === 0) setStakedAmount(0)
  }

  const isInsufficient = spendableBalance - stakedAmount < 0.01

  return (
    <Flex flexDir='column'>
      <Header mb='24px'>Select Amount</Header>
      <ColumnHeader mb='12px'>SPENDABLE BALANCE</ColumnHeader>
      <BalanceBox balance={spendableBalance} />
      <ColumnHeader mb='12px'>ENTER AMOUNT</ColumnHeader>
      <InputGroup size='md' mb='30px'>
        <Input
          isRequired
          type='number'
          onChange={handleChange}
          value={stakedAmount ? stakedAmount : undefined}
          pr='4.5rem'
          placeholder='0.00'
          fontWeight={600}
          _placeholder={{ fontWeight: 600 }}
        />
      </InputGroup>
      {isInsufficient && (
        <Flex alignItems='center' gap='8px' mb='30px'>
          <Image src='/images/AlertIcon.svg' alt='alert icon' />
          <Text opacity={0.8} fontSize='14px' fontWeight={400} color='#C53030'>
            Insufficient balance! Keep minimum 0.01 tez spendable to cover fees
            for this and future operations.
          </Text>
        </Flex>
      )}
      <PrimaryButton
        disabled={!stakedAmount}
        onClick={async () => {
          if (!Tezos || !beaconWallet) {
            setErrorMessage('Wallet is not initialized, log out to try again.')
            return
          }

          trackGAEvent(GAAction.BUTTON_CLICK, GACategory.START_STAKE_BEGIN)

          setWaitingOperation(true)
          const response = await stake(Tezos, stakedAmount, beaconWallet)
          setWaitingOperation(false)

          if (response.success) {
            trackGAEvent(GAAction.BUTTON_CLICK, GACategory.START_STAKE_END)
            setOpHash(response.opHash)
            setOpType('stake')
            setMessage(`You have successfully staked ${stakedAmount} ꜩ.`)
            setSuccess(true)
            setStakedAmount(0)
            handleOneStepForward()
          } else {
            setErrorMessage(response.message)
          }
        }}
      >
        {waitingOperation ? <Spinner /> : 'Stake'}
      </PrimaryButton>
      {!!errorMessage && <ErrorBlock errorMessage={errorMessage} />}
    </Flex>
  )
}

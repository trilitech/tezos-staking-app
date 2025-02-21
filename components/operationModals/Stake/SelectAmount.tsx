import React from 'react'
import { Flex, InputGroup, Input, Image, Text } from '@chakra-ui/react'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
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
  const handleChange = (event: any) => {
    const val = Number(event.target.value)
    trackGAEvent(GAAction.BUTTON_CLICK, GACategory.INPUT_AMOUNT)
    setStakedAmount(val || 0)
  }

  const isInsufficient = stakedAmount > spendableBalance - 0.01

  return (
    <Flex flexDir='column'>
      <Header mb='24px'>Stake Amount</Header>
      <ColumnHeader mb='12px'>SPENDABLE BALANCE</ColumnHeader>
      <BalanceBox balance={spendableBalance} />
      <ColumnHeader mb='12px'>ENTER AMOUNT</ColumnHeader>
      <InputGroup size='md' mb='30px'>
        <Input
          h='46px'
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
        disabled={!stakedAmount || isInsufficient}
        onClick={async () => {
          handleOneStepForward()
        }}
      >
        Continue
      </PrimaryButton>
    </Flex>
  )
}

import React, { useEffect } from 'react'
import { Flex, Input, Image, Text, Field } from '@chakra-ui/react'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

export const SelectAmount = ({
  spendableBalance,
  handleOneStepForward,
  setStakedAmount,
  stakedAmount,
  inputRef
}: {
  spendableBalance: number
  handleOneStepForward: () => void
  setStakedAmount: (arg: number) => void
  stakedAmount: number
  inputRef: React.RefObject<HTMLInputElement>
}) => {
  useEffect(() => {
    if (inputRef?.current) {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight * 0.6,
          behavior: 'smooth'
        })
      }, 1)
    }
  }, [inputRef])

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
      <Field.Root mb='30px' required>
        <Input
          ref={inputRef}
          h='46px'
          onChange={handleChange}
          value={stakedAmount ? stakedAmount : undefined}
          px='16px'
          placeholder='0.00'
          fontWeight={600}
          _placeholder={{ fontWeight: 600 }}
        />
      </Field.Root>
      {isInsufficient && (
        <Flex alignItems='center' gap='8px' mb='30px'>
          <Image src='/images/AlertIcon.svg' alt='alert icon' />
          <Text opacity={0.8} fontSize='14px' fontWeight={400} color='darkRed'>
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

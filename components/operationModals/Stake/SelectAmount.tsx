import React from 'react'
import {
  Flex,
  InputGroup,
  InputRightElement,
  Input,
  Button
} from '@chakra-ui/react'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'

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

    if (val <= spendableBalance) setStakedAmount(val)
    else if (val === 0) setStakedAmount(0)
  }

  const setMax = () => setStakedAmount(spendableBalance)

  return (
    <Flex flexDir='column'>
      <Header my='24px'>Select Amount</Header>
      <ColumnHeader mb='12px'>AVAILABLE</ColumnHeader>
      <BalanceBox balance={spendableBalance} mb='30px' />
      <ColumnHeader mb='12px'>ENTER AMOUNT</ColumnHeader>
      <InputGroup size='md' mb='30px'>
        <Input
          isRequired
          type='number'
          onChange={handleChange}
          value={stakedAmount ? stakedAmount : undefined}
          pr='4.5rem'
          placeholder='0.00'
        />
        <InputRightElement width='4.5rem' pr='12px'>
          <Button
            borderRadius='8px'
            bg={stakedAmount === spendableBalance ? '#A0AEC0' : '#0052FF'}
            color='white'
            h='1.75rem'
            size='sm'
            _hover={{
              bg: stakedAmount === spendableBalance ? '#A0AEC0' : '#0052FF'
            }}
            onClick={setMax}
          >
            Max
          </Button>
        </InputRightElement>
      </InputGroup>
      <PrimaryButton
        disabled={!stakedAmount}
        onClick={() => {
          handleOneStepForward()
        }}
      >
        Preview
      </PrimaryButton>
    </Flex>
  )
}

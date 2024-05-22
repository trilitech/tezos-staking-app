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
  stakedAmount,
  unstakeAmount,
  setUnstakeAmount,
  handleOneStepForward
}: {
  stakedAmount: number
  unstakeAmount: number
  setUnstakeAmount: (arg: number) => void
  handleOneStepForward: () => void
}) => {
  const handleChange = (event: any) => {
    const val = Number(event.target.value)

    if (val <= stakedAmount) setUnstakeAmount(val)
    else if (!val) setUnstakeAmount(0)
  }

  const setMax = () => setUnstakeAmount(stakedAmount)

  return (
    <Flex flexDir='column'>
      <Header my='24px'>Select Amount</Header>
      <ColumnHeader mb='12px'>STAKED</ColumnHeader>
      <BalanceBox balance={stakedAmount} mb='30px' />
      <ColumnHeader mb='12px'>ENTER AMOUNT</ColumnHeader>
      <InputGroup size='md' mb='30px'>
        <Input
          isRequired
          type='number'
          onChange={handleChange}
          value={unstakeAmount ? unstakeAmount : undefined}
          pr='4.5rem'
          placeholder='0.00'
        />
        <InputRightElement width='4.5rem' pr='12px'>
          <Button
            borderRadius='8px'
            bg={unstakeAmount === stakedAmount ? '#A0AEC0' : '#0052FF'}
            color='white'
            h='1.75rem'
            size='sm'
            _hover={{
              bg: unstakeAmount === stakedAmount ? '#A0AEC0' : '#0052FF'
            }}
            onClick={setMax}
          >
            Max
          </Button>
        </InputRightElement>
      </InputGroup>
      <PrimaryButton
        disabled={!unstakeAmount}
        onClick={() => {
          handleOneStepForward()
        }}
      >
        Preview
      </PrimaryButton>
    </Flex>
  )
}

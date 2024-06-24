import React, { useState } from 'react'
import {
  Flex,
  InputGroup,
  InputRightElement,
  Input,
  Button,
  Spinner
} from '@chakra-ui/react'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { unstake } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'

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
  const { Tezos, beaconWallet } = useConnection()
  const { setMessage, setSuccess, setOpHash, setTitle } = useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)

  const handleChange = (event: any) => {
    const val = Number(event.target.value)

    if (val <= stakedAmount) setUnstakeAmount(val)
    else if (!val) setUnstakeAmount(0)
  }

  const setMax = () => setUnstakeAmount(stakedAmount)

  return (
    <Flex flexDir='column'>
      <Header mb='24px'>Select Amount</Header>
      <ColumnHeader mb='12px'>STAKED</ColumnHeader>
      <BalanceBox balance={stakedAmount} />
      <ColumnHeader mb='12px'>ENTER AMOUNT</ColumnHeader>
      <InputGroup size='md' mb='30px'>
        <Input
          isRequired
          type='number'
          onChange={handleChange}
          value={unstakeAmount ? unstakeAmount : undefined}
          pr='4.5rem'
          placeholder='0.00'
          fontWeight={600}
          h='58px'
          _placeholder={{ fontWeight: 600, fontSize: '16px' }}
        />
        <InputRightElement width='4.5rem' pr='12px' h='100%'>
          <Button
            borderRadius='8px'
            bg={unstakeAmount === stakedAmount ? '#A0AEC0' : '#0052FF'}
            color='white'
            fontWeight={600}
            fontSize='16px'
            h='34px'
            px='12px'
            py='6px'
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
        onClick={async () => {
          if (!Tezos || !beaconWallet) {
            setErrorMessage('Wallet is not initialized, log out to try again.')
            return
          }

          setWaitingOperation(true)
          const response = await unstake(Tezos, unstakeAmount, beaconWallet)
          setWaitingOperation(false)

          if (response.success) {
            setOpHash(response.opHash)
            setTitle('Unstake Requested')
            setMessage(
              `You have unstaked ${unstakeAmount} tez. Wait for 4 cycles and then finalize your balance.`
            )
            setSuccess(true)
            setUnstakeAmount(0)
            handleOneStepForward()
          } else {
            setErrorMessage(response.message)
          }
        }}
      >
        {waitingOperation ? <Spinner /> : 'Unstake'}
      </PrimaryButton>
      {!!errorMessage && <ErrorBlock errorMessage={errorMessage} />}
    </Flex>
  )
}

import React, { useState } from 'react'
import {
  Flex,
  Box,
  InputGroup,
  Input,
  Button,
  Spinner,
  Field
} from '@chakra-ui/react'
import { Header, ColumnHeader, BalanceBox } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { unstake } from '@/components/Operations/operations'
import { useConnection } from '@/providers/ConnectionProvider'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

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
  const { setMessage, setSuccess, setAmount, setOpHash, setTitle, setOpType } =
    useOperationResponse()
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
      <Header mb='24px'>Unstake Amount</Header>
      <ColumnHeader mb='12px'>STAKED</ColumnHeader>
      <BalanceBox balance={stakedAmount} />
      <ColumnHeader mb='12px'>ENTER AMOUNT</ColumnHeader>
      <InputGroup
        mb='30px'
        endElement={
          <Box width='4.5rem' pr='12px' h='100%'>
            <Button
              borderRadius='8px'
              bg={unstakeAmount === stakedAmount ? 'gray.400' : 'blue'}
              color='white'
              fontWeight={600}
              fontSize='16px'
              h='34px'
              px='12px'
              py='6px'
              _hover={{
                bg: unstakeAmount === stakedAmount ? 'gray.400' : 'blue'
              }}
              onClick={setMax}
            >
              Max
            </Button>
          </Box>
        }
      >
        <Input
          h='46px'
          type='number'
          onChange={handleChange}
          value={unstakeAmount ? unstakeAmount : undefined}
          pr='4.5rem'
          placeholder='0.00'
          fontWeight={600}
          _placeholder={{ fontWeight: 600, fontSize: '16px' }}
        />
      </InputGroup>
      <PrimaryButton
        disabled={!unstakeAmount}
        onClick={async () => {
          if (!Tezos || !beaconWallet) {
            setErrorMessage('Wallet is not initialized, log out to try again.')
            return
          }

          trackGAEvent(GAAction.BUTTON_CLICK, GACategory.END_STAKE_BEGIN)

          setWaitingOperation(true)
          const response = await unstake(Tezos, unstakeAmount, beaconWallet)
          setWaitingOperation(false)

          if (response.success) {
            trackGAEvent(GAAction.BUTTON_CLICK, GACategory.END_STAKE_END)
            setOpHash(response.opHash)
            setTitle('Unstake Requested')
            setMessage(
              `You have unstaked ${unstakeAmount} tez. After ${process.env.NEXT_PUBLIC_UNSTAKE_DAYS} days, you must finalize the unstaking process, after which your staked balance will become available in your wallet again.`
            )
            setOpType('unstake')
            setSuccess(true)
            setAmount(unstakeAmount)
            setUnstakeAmount(0)
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

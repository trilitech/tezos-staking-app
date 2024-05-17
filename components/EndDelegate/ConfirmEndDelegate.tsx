import React from 'react'
import { Flex, Text, Image } from '@chakra-ui/react'
import { PrimaryButton } from '../buttons/PrimaryButton'
import { Header } from '../modalBodyFont/Header'
import { ColumnHeader } from '../modalBodyFont/ColumnHeader'
import { setDelegate, OperationResult } from '../Operations/operations'
import { useConnection } from '../ConnectionProvider'
import { TezosToolkit } from '@taquito/taquito'

interface ConfirmEndDelegate {
  balance: number
  handleOneStepForward: () => void
  bakerAddress: string
  setOpResult: (res: OperationResult | null) => void
  setDisableOnClick: (arg: boolean) => void
}

export const ConfirmEndDelegate = ({
  balance,
  handleOneStepForward,
  bakerAddress,
  setOpResult,
  setDisableOnClick
}: ConfirmEndDelegate) => {
  const { Tezos } = useConnection()

  return (
    <Flex flexDir='column' justify='center'>
      <Header my='24px'>Confirm</Header>
      <ColumnHeader mb='12px'>AVAILABLE</ColumnHeader>
      <Flex
        justify='space-between'
        alignItems='center'
        borderRadius='8px'
        w='100%'
        py='12px'
        px='16px'
        bg='#EDF2F7'
        mb='30px'
      >
        <Text>{balance}</Text>
        <Image src='/images/xtz-icon.svg' alt='xtz icon' />
      </Flex>
      <ColumnHeader mb='12px'>BAKER</ColumnHeader>
      <Flex
        justify='space-between'
        alignItems='center'
        borderRadius='8px'
        w='100%'
        py='12px'
        px='16px'
        bg='#EDF2F7'
        mb='30px'
      >
        <Text>{bakerAddress}</Text>
      </Flex>
      <PrimaryButton
        onClick={async () => {
          setDisableOnClick(true)
          const response = await setDelegate(Tezos as TezosToolkit, undefined)
          setOpResult(response)
          setDisableOnClick(false)
          handleOneStepForward()
        }}
      >
        Confirm
      </PrimaryButton>
    </Flex>
  )
}

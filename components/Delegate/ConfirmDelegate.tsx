import React from 'react'
import { Image, Flex, Text, InputGroup, Input } from '@chakra-ui/react'
import { BakerInfo } from '../Operations/tezInterfaces'
import { PrimaryButton } from '../buttons/PrimaryButton'
import { setDelegate, OperationResult } from '../Operations/operations'
import { useConnection } from '../ConnectionProvider'
import { TezosToolkit } from '@taquito/taquito'

interface ConfirmDelegateProps {
  availableBalance: number
  handleOneStepForward: () => void
  selectedBaker: BakerInfo
  setOpResult: (res: OperationResult | null) => void
  setDisableOnClick: (arg: boolean) => void
}

export const ConfirmDelegate = ({
  availableBalance,
  handleOneStepForward,
  selectedBaker,
  setOpResult,
  setDisableOnClick
}: ConfirmDelegateProps) => {
  const { Tezos } = useConnection()

  return (
    <Flex flexDir='column' justify='center'>
      <Text textAlign='center' fontSize='24px' py='24px' fontWeight={600}>
        Confirm
      </Text>
      <Text color='#4A5568' fontSize='14px' pb='12px'>
        AVAILABLE
      </Text>
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
        <Text>{availableBalance}</Text>
        <Image src='/images/xtz-icon.svg' alt='xtz icon' />
      </Flex>
      <Flex alignItems='center' justify='space-between' mb='12px'>
        <Text color='#4A5568' fontSize='14px'>
          Baker
        </Text>
      </Flex>
      <InputGroup bg='#EDF2F7' size='md' mb='30px'>
        <Input
          readOnly
          pr='4.5rem'
          placeholder='Paste tz address'
          value={selectedBaker.address}
        />
      </InputGroup>
      <PrimaryButton
        onClick={async () => {
          setDisableOnClick(true)
          const response = await setDelegate(
            Tezos as TezosToolkit,
            selectedBaker.address
          )
          setOpResult(response)
          setDisableOnClick(false)
          if (response.success) handleOneStepForward()
        }}
      >
        Confirm
      </PrimaryButton>
    </Flex>
  )
}

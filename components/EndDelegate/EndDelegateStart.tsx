import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { PrimaryButton } from '../buttons/PrimaryButton'
import { Header } from '../modalBodyFont/Header'
import { ColumnHeader } from '../modalBodyFont/ColumnHeader'

export const EndDelegateStart = ({
  bakerAddress,
  handleOneStepForward
}: {
  bakerAddress: string
  handleOneStepForward: () => void
}) => {
  return (
    <Flex flexDir='column' justify='center'>
      <Header my='24px'>End Delegation</Header>
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
      <PrimaryButton onClick={handleOneStepForward}>Preview</PrimaryButton>
    </Flex>
  )
}

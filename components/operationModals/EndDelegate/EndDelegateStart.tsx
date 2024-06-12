import React from 'react'
import { Flex } from '@chakra-ui/react'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { Header, ColumnHeader, AddressBox } from '@/components/modalBody'

export const EndDelegateStart = ({
  bakerName,
  handleOneStepForward
}: {
  bakerName: string
  handleOneStepForward: () => void
}) => {
  return (
    <Flex flexDir='column' justify='center'>
      <Header my='24px'>End Delegation</Header>
      <ColumnHeader mb='12px'>BAKER</ColumnHeader>
      <AddressBox address={bakerName} />
      <PrimaryButton onClick={handleOneStepForward}>Preview</PrimaryButton>
    </Flex>
  )
}

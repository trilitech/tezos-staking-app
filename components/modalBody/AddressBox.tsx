import React from 'react'
import { Flex, Text, Image } from '@chakra-ui/react'
import { simplifyAddress } from '@/utils/simpliftAddress'

export const AddressBox = ({ address }: { address: string }) => {
  return (
    <Flex
      alignItems='center'
      borderRadius='8px'
      w='100%'
      py='8px'
      px='12px'
      bg='#EDF2F7'
      mb='30px'
    >
      <Image
        w='30px'
        h='30px'
        src={`https://services.tzkt.io/v1/avatars/${address}`}
        alt='baker avatar'
      />
      <Text>{simplifyAddress(address)}</Text>
    </Flex>
  )
}

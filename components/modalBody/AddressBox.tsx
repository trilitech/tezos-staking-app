import React from 'react'
import { Flex, Text, Image } from '@chakra-ui/react'

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
      gap='5px'
      overflowX='auto'
    >
      <Image
        w='30px'
        h='30px'
        src={`${process.env.NEXT_PUBLIC_TZKT_AVATARS_URL}/${address}`}
        alt='baker avatar'
      />
      <Text fontSize='16px' fontWeight={600} lineHeight='22px' color='#4A5568'>
        {address}
      </Text>
    </Flex>
  )
}

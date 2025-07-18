import React from 'react'
import { Alert } from '@chakra-ui/react'
import { CircleCheck } from 'lucide-react'

export const CopyAlert = () => {
  return (
    <Alert.Root
      pos='absolute'
      top='20px'
      left='0'
      right='0'
      margin='auto'
      w='120px'
      textAlign='center'
      status='success'
      borderRadius='10px'
      zIndex={999}
      bg='transparent'
      color='black'
    >
      <CircleCheck />
      Copied
    </Alert.Root>
  )
}

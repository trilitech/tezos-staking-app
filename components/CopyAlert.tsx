import React from 'react'
import { Alert, AlertIcon } from '@chakra-ui/react'

export const CopyAlert = () => {
  return (
    <Alert
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
    >
      <AlertIcon />
      Copied
    </Alert>
  )
}

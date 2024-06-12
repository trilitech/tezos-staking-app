import React from 'react'
import { Flex, Text, Image, FlexProps, Spinner } from '@chakra-ui/react'
import { mutezToTez } from '@/utils/mutezToTez'

type Status = 'success' | 'pending' | 'error'

export const BalanceBox = ({
  balance,
  gasFeeStatus,
  fee,
  ...styles
}: {
  balance: number
  gasFeeStatus?: Status
  fee?: number
} & FlexProps) => {
  const setFee = () => {
    switch (gasFeeStatus) {
      case 'success':
        return (
          <Text fontWeight={600} alignSelf='end' fontSize='14px'>
            <Text as='span' color='#4A5568'>
              FEE:
            </Text>{' '}
            {mutezToTez(fee as number)}{' '}
            <Text as='span' color='#10121B' fontWeight={400}>
              ꜩ
            </Text>
          </Text>
        )

      case 'pending':
        return (
          <Text fontWeight={600} alignSelf='end' fontSize='14px'>
            <Text as='span' color='#4A5568'>
              FEE:
            </Text>{' '}
            <Spinner size='xs' />
          </Text>
        )
      case 'error':
        return (
          <Text fontWeight={600} alignSelf='end' fontSize='14px'>
            Fail to get fee
          </Text>
        )
      default:
        return <></>
    }
  }

  return (
    <Flex flexDir='column' gap='12px' {...styles}>
      <Flex
        justify='space-between'
        alignItems='center'
        borderRadius='8px'
        w='100%'
        py='12px'
        px='16px'
        bg='#EDF2F7'
      >
        <Text fontWeight={600} color='#4A5568' fontSize='16px'>
          {balance}
        </Text>
        <Image src='/images/xtz-icon.svg' alt='xtz icon' />
      </Flex>
      {setFee()}
    </Flex>
  )
}

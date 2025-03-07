import React from 'react'
import { Flex, Text, Icon, IconProps } from '@chakra-ui/react'

export const End = ({ onClick }: { onClick: () => void }) => {
  return (
    <Flex
      alignItems='center'
      border='1px solid'
      borderColor='gray.200'
      borderRadius='8px'
      px='3'
      py='6px'
      gap='4px'
      onClick={onClick}
      transition='all .5s ease-out'
      color='gray.700'
      _hover={{ cursor: 'pointer', color: 'gray.500' }}
    >
      <Text fontSize='14px' fontWeight={600}>
        End
      </Text>
      <EndIcon color='gray.400' />
    </Flex>
  )
}

export const EndIcon = ({ ...styles }: IconProps) => {
  return (
    <Icon width='18px' height='18px' viewBox='0 0 18 18' {...styles}>
      <path
        id='Vector (Stroke)'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.0303 3.96967C14.3232 4.26256 14.3232 4.73744 14.0303 5.03033L5.03033 14.0303C4.73744 14.3232 4.26256 14.3232 3.96967 14.0303C3.67678 13.7374 3.67678 13.2626 3.96967 12.9697L12.9697 3.96967C13.2626 3.67678 13.7374 3.67678 14.0303 3.96967Z'
        fill='currentColor'
      />
      <path
        id='Vector (Stroke)_2'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3.96967 3.96967C4.26256 3.67678 4.73744 3.67678 5.03033 3.96967L14.0303 12.9697C14.3232 13.2626 14.3232 13.7374 14.0303 14.0303C13.7374 14.3232 13.2626 14.3232 12.9697 14.0303L3.96967 5.03033C3.67678 4.73744 3.67678 4.26256 3.96967 3.96967Z'
        fill='currentColor'
      />
    </Icon>
  )
}

import React from 'react'
import { Icon, IconProps } from '@chakra-ui/react'

export const WarningIcon = ({ ...styles }: IconProps) => {
  return (
    <Icon
      width='24px'
      height='24px'
      viewBox='0 0 24 24'
      color='#2D3748'
      transition='all .5s ease-out'
      _hover={{ color: '#718096', cursor: 'pointer' }}
      {...styles}
    >
      <path
        id='Vector (Stroke)'
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289Z'
        fill='currentColor'
      />
      <path
        id='Vector (Stroke)_2'
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z'
        fill='currentColor'
      />
    </Icon>
  )
}

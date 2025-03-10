import React from 'react'
import { Icon, IconProps } from '@chakra-ui/react'

export const WarningIcon = ({ ...styles }: IconProps) => {
  return (
    <Icon
      width='24px'
      height='24px'
      viewBox='0 0 24 24'
      fill='gray.500'
      xmlns='http://www.w3.org/2000/svg'
      {...styles}
    >
      <g id='AlertIcon'>
        <path
          id='Vector'
          d='M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z'
        />
      </g>
    </Icon>
  )
}

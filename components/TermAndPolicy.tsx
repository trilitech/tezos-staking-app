import React from 'react'
import { Flex, Text, FlexProps } from '@chakra-ui/react'
import Link from 'next/link'

export const TermAndPolicy = ({ ...styles }: FlexProps) => {
  return (
    <Flex
      flexDir={['column', 'row']}
      justify='space-between'
      w='100%'
      alignItems='center'
      fontSize='14px'
      gap={['0px', '10px']}
      {...styles}
    >
      <Text>© 2024 Tezos.Staking | Terms | Privacy</Text>

      <Text>
        Powered by{' '}
        <Link href='https://tezos.com' target='_blank'>
          <Text as='span' textDecor='underline'>
            Tezos
          </Text>
        </Link>
      </Text>
    </Flex>
  )
}

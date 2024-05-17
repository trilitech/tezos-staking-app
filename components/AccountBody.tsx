import React from 'react'
import { Flex, Image, Text, Button, Grid } from '@chakra-ui/react'
import { DelegateData } from '../app/page'
import { ExternalLinkIcon } from '@chakra-ui/icons'

type DelegationStatus = 'inactive' | 'active'

export const AccountBody = ({
  address,
  balance,
  stakedBalance,
  unstakedBalance,
  delegationStatus
}: DelegateData & { delegationStatus: DelegationStatus }) => {
  return (
    <Flex
      flexDir='column'
      alignItems='center'
      justify='space-around'
      p='40px'
      borderRadius='16px'
      bg='#FFF'
      w='100%'
      gap={['30px', null, '40px']}
    >
      <Grid
        w='100%'
        templateColumns={['repeat(1, 1fr)', null, 'repeat(2, 1fr)']}
        gap='20px'
      >
        <Flex flexDir='column' borderTop='1px solid #EDF2F7' pt='20px'>
          <Text fontSize='14px' color='#4A5568'>
            AVAILABLE
          </Text>
          <Text>{balance / 1000000} ꜩ</Text>
        </Flex>
        <Flex flexDir='column' borderTop='1px solid #EDF2F7' pt='20px'>
          <Text fontSize='14px' color='#4A5568'>
            STAKED
          </Text>
          <Text>{stakedBalance / 1000000} ꜩ</Text>
        </Flex>
        <Flex flexDir='column' borderTop='1px solid #EDF2F7' pt='20px'>
          <Text fontSize='14px' color='#4A5568'>
            DELEGATION
          </Text>
          <Flex alignItems='center' gap='5px'>
            {delegationStatus === 'active' ? (
              <Image src='/images/active-icon.svg' alt='active icon' />
            ) : (
              <Image src='/images/inactive-icon.svg' alt='inactive icon' />
            )}
            <Text>
              {delegationStatus === 'active' ? 'Active ' : 'Inactive'}
            </Text>
          </Flex>
        </Flex>
        <Flex flexDir='column' borderTop='1px solid #EDF2F7' pt='20px'>
          <Flex justify='space-between' alignItems='center'>
            <Text fontSize='14px' color='#4A5568'>
              BAKER
            </Text>
            <Flex justify='center' alignItems='center' gap='5px'>
              <Text fontSize='14px'>View bakers</Text>
              <ExternalLinkIcon />
            </Flex>
          </Flex>
          <Text>- -</Text>
        </Flex>
      </Grid>
      {/* here to integrate ajinkya buttons */}
      <Flex w='100%' gap='20px'>
        <Button w='100%'>Placeholder</Button>
        <Button w='100%'>Placeholder</Button>
      </Flex>
    </Flex>
  )
}

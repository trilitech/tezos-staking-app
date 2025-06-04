'use client'

import { Box, Flex, Text, Button } from '@chakra-ui/react'
import { CustomButton } from './buttons/CustomButton'
import Link from 'next/link'

export default function Footer() {
  return (
    <Flex w='full'>
      <Flex
        borderRadius={[0, null, null, '4px']}
        bg='transparent'
        mt={[null, null, null, '24px']}
        overflow='hidden'
        maxW='1232px'
        w='100%'
        mx='auto'
        flexDirection='column'
      >
        <Flex
          w='100%'
          justifyContent={['center', null, 'space-between']}
          alignItems='center'
          flexDirection={['column', null, 'row']}
          bgSize='contain'
          bgRepeat='no-repeat'
          zIndex={0}
          borderRadius='4px'
          py='48px'
          px={[6, 12]}
          gap={['24px', null, '80px']}
        >
          <Flex
            flexDirection={['row', null, 'row']}
            alignItems={['center', null, 'center']}
            color='white'
            flex={1}
            justifyContent={['center', null, 'flex-start']}
          >
            <Text
              w='max-content'
              display={['none', null, 'inline-block']}
              fontSize={['sm', null, '18px']}
              pr='24px'
            >
              © {new Date().getFullYear()} Trilitech Limited
            </Text>
            <Box display={['none', null, 'block']} />{' '}
            <Box
              mx='24px'
              my='auto'
              bg='gray.300'
              borderRadius='100px'
              h='12px'
              w='2px'
              display={['none', null, 'block']}
            />
            <CustomButton
              variant='ternary'
              px='12px'
              py='6px'
              fontSize={['sm', null, '18px']}
              fontWeight='400'
              height='36px'
              asChild
            >
              <Link href='/termsOfUseStakingApp/' target='_blank'>
                Terms
              </Link>
            </CustomButton>
            <Box
              mx='24px'
              my='auto'
              bg='gray.300'
              borderRadius='100px'
              h='12px'
              w='2px'
              display={['none', null, 'block']}
            />
            <CustomButton
              variant='ternary'
              px='12px'
              py='6px'
              fontSize={['sm', null, '18px']}
              fontWeight='400'
              height='36px'
              asChild
            >
              <Link href='/privacy_policy/' target='_blank'>
                Privacy
              </Link>
            </CustomButton>
            <Box
              mx='24px'
              my='auto'
              bg='gray.300'
              borderRadius='100px'
              h='12px'
              w='2px'
            />
            <CustomButton
              variant='ternary'
              px='12px'
              py='6px'
              fontSize={['sm', null, '18px']}
              fontWeight='400'
              height='36px'
              asChild
            >
              <Link href='/faqs'>Help</Link>
            </CustomButton>
          </Flex>
          <Flex
            mt={['12px', null, 0]}
            justifyContent={['center', null, 'flex-end']}
            color='white'
          >
            <Text
              display={['flex', null, 'none']}
              fontSize={['sm', null, '18px']}
              color='gray.300'
            >
              © {new Date().getFullYear()} Trilitech Limited
              &nbsp;|&nbsp;&nbsp;
            </Text>
            <Text
              color={['gray.300', null, 'white']}
              fontSize={['sm', null, '18px']}
            >
              Powered by&nbsp;
            </Text>
            <Link href='https://tezos.com' target='_blank'>
              <Text
                color={['gray.300', null, 'white']}
                fontSize={['sm', null, '18px']}
                textDecor='underline'
              >
                Tezos
              </Text>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

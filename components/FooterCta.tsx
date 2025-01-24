'use client'

import { Heading, Text, Flex, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function FooterCta() {
  return (
    <>
      <Flex px={6} bg='gray.100' w='full'>
        <Flex
          borderRadius={[0, null, null, '4px']}
          bg='transparent'
          mt={[null, null, null, '24px']}
          overflow='hidden'
          maxW='1232px'
          w='100%'
          mx='auto'
        >
          <Flex
            w='100%'
            flexDir={['column', null, 'row']}
            position='relative'
            bgSize='contain'
            bgRepeat='no-repeat'
            zIndex={0}
            borderRadius='4px'
            py='48px'
            gap={['43px', '80px']}
          >
            <Flex
              bg='linear-gradient(90deg, #6A327A 0%, #645DFA 100%)'
              textAlign={'center'}
              flexDir='column'
              position='relative'
              zIndex={1}
              flex={1}
              borderRadius='16px'
              pb='64px'
              pt='56px'
              px='48px'
            >
              <Heading
                as='h1'
                fontSize={['36px', '40px']}
                color='white'
                textAlign='left'
                fontWeight={600}
                pb='16px'
              >
                Have a question?
              </Heading>
              <Text
                textAlign='left'
                as='h2'
                fontSize={['lg', null, 'lg']}
                color={'white'}
                pb={['24px', null, '24px']}
              >
                Visit the FAQ page to find answers to questions about
                delegation, staking, and more.
              </Text>
              <Button
                as='a'
                href='/faqs'
                variant='primary'
                w={['full', '180px']}
              >
                Visit FAQ
              </Button>
            </Flex>
            <Flex
              bg='linear-gradient(90deg, rgba(106, 50, 122, 0.1) 0%, rgba(100, 93, 250, 0.1) 100%)'
              textAlign={'center'}
              flexDir='column'
              position='relative'
              zIndex={1}
              flex={1}
              borderRadius='16px'
              pb='64px'
              pt='56px'
              px='48px'
            >
              {' '}
              <Heading
                as='h1'
                fontSize={['36px', '40px']}
                color='black'
                textAlign='left'
                fontWeight={600}
                pb='16px'
              >
                Earn rewards
              </Heading>
              <Text
                textAlign='left'
                as='h2'
                fontSize={['lg', null, 'lg']}
                color={'black'}
                pb={['24px', null, '24px']}
              >
                Visit the FAQ page to find answers to questions about
                delegation, staking, and more.
              </Text>
              <Button
                as='a'
                href='/connect'
                variant='primary'
                w={['full', '180px']}
              >
                Start Earning
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

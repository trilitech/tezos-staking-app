'use client'

import {
  Box,
  Heading,
  Text,
  Flex,
  Divider,
  Button,
  Image
} from '@chakra-ui/react'
import { Header } from './Header'

export default function Hero() {
  return (
    <Box
      w='100%'
      backgroundSize='cover'
      backgroundBlendMode='multiply'
      bg="linear-gradient(90deg, #6C235E 0%, #5C72FA 100%), url('/images/hero-pattern.png')"
    >
      <Header />
      <Flex
        backgroundSize='contain'
        backgroundBlendMode='multiply'
        bg="linear-gradient(90deg, #6C235E 0%, #5C72FA 100%), url('/images/hero-pattern.png')"
        w='full'
        px={6}
      >
        <Flex
          borderRadius={[0, null, null, '4px']}
          bg='transparent'
          mt={[null, null, null, '24px']}
          maxW='1232px'
          w='100%'
          mx='auto'
          gap={['43px', '80px']}
        >
          <Box
            flex={1}
            position='relative'
            bgSize='contain'
            bgRepeat='no-repeat'
            zIndex={0}
            borderRadius='4px'
            py={['12px', null, '48px']}
          >
            <Flex
              textAlign={'center'}
              flexDir='column'
              position='relative'
              zIndex={1}
            >
              <Text
                px='12px'
                py='6px'
                borderRadius='8px'
                backgroundColor='#CBD5E014'
                textAlign={['center', null, 'left']}
                as='h2'
                fontSize={['sm', null, 'sm']}
                color='white'
                mb={['30px', null, '30px']}
                w={['100%', null, 'fit-content']}
                border='1px solid'
                borderColor='#FFFFFF0A'
              >
                • &nbsp;Staking Version 2.0—see all updates here
              </Text>
              <Heading
                as='h1'
                fontSize={['44px', null, '7xl']}
                lineHeight={['52px', null, '82.5px']}
                color='gray.50'
                textAlign='left'
                fontWeight={600}
                pb='24px'
              >
                Earn rewards for contributing to network security
              </Heading>

              <Text
                textAlign='left'
                as='h2'
                fontSize='xl'
                color={'gray.300'}
                pb={['43px', null, '30px']}
              >
                Stake your tez to earn greater rewards for participating in
                Tezos' proof-of-stake mechanism.
              </Text>
              <Flex
                w='full'
                direction={['column', 'row']}
                gap={[2, 3]}
                align={'center'}
                alignSelf={['center', 'start']}
                position={'relative'}
              >
                <Button
                  scrollPadding={80}
                  scrollMarginBottom={70}
                  as='a'
                  href='/connect'
                  variant='primary'
                  w={['full', null, '180px']}
                >
                  Start Earning
                </Button>
              </Flex>
              <Divider
                pt={5}
                display={['none', 'block']}
                borderColor='transparent'
                opacity='0.1'
              />
            </Flex>
          </Box>
          <Flex
            display={['none', null, 'flex']}
            textAlign={'center'}
            flexDir='column'
            position='relative'
            zIndex={1}
            flex={1}
            borderRadius='16px'
            my='48px'
          >
            <Image
              src='/images/staking-hero.png'
              alt='Tutorial connect'
              objectFit='contain'
              position='absolute'
              transform='scale(1.4)'
              top='0'
              left='20%'
              width='100%'
              height='100%'
              borderRadius='16px'
              zIndex={-1}
            />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
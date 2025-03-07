'use client'

import { Box, Heading, Text, Flex, Image, Button } from '@chakra-ui/react'

export default function StakeOptions() {
  return (
    <Flex
      px={6}
      position='relative'
      overflow='hidden'
      bg='linear-gradient(0deg, rgba(240,240,255,1) 0%, rgba(240,240,255,1) 50%, rgba(240,240,255,0) 100%)'
      w='full'
    >
      <Box
        position='absolute'
        top='0'
        left='0'
        right='0'
        height='200px'
        bg='linear-gradient(90deg, #6C235E 0%, #5C72FA 100%)'
        bgRepeat='no-repeat'
        zIndex='0'
      />
      <Box
        position='absolute'
        top='100px'
        left='-300px'
        right='-300px'
        height='200px'
        bg='linear-gradient(90deg, #6C235E 0%, #5C72FA 100%)'
        filter='blur(37px)'
        bgRepeat='no-repeat'
        zIndex='0'
      />
      <Flex
        borderRadius={[0, null, null, '4px']}
        mt={[null, null, null, '24px']}
        overflow='hidden'
        maxW='1232px'
        w='100%'
        mx='auto'
      >
        <Flex
          w='100%'
          flexDir={['column', null, null, 'row']}
          position='relative'
          bgSize='contain'
          bgRepeat='no-repeat'
          zIndex={2}
          borderRadius='4px'
          py='48px'
          gap={['43px', null, null, '80px']}
        >
          <Flex
            bg='white'
            boxShadow='0px 2px 12px 0px rgba(20, 20, 43, 0.08)'
            textAlign={'center'}
            flexDir='column'
            position='relative'
            zIndex={1}
            flex={1}
            borderRadius='16px'
            py={['24px', null, '40px']}
            px={['24px', null, null, null, '48px']}
          >
            <Heading
              as='h1'
              fontFamily='Inter, sans-serif'
              fontSize='2xl'
              color='gray.900'
              textAlign='left'
              fontWeight={600}
              pb='16px'
            >
              Delegate
            </Heading>
            <Text
              textAlign='left'
              as='h2'
              fontSize={['sm', null, 'lg']}
              color={'gray.600'}
              pb={['0px', null, '24px']}
            >
              Earn risk-free rewards by delegating
            </Text>
            <Flex
              display={['none', null, 'flex']}
              py='18px'
              borderTop='1px solid #EDF2F7'
              gap={2}
            >
              <Image
                maxW='110px'
                src='/images/copy-alt-icon.svg'
                alt='Wallet Icon'
              />
              <Text fontSize='lg'>Your full balance will be delegated</Text>
            </Flex>
            <Flex
              display={['none', null, 'flex']}
              py='18px'
              borderTop='1px solid #EDF2F7'
              gap={2}
            >
              <Image
                maxW='110px'
                src='/images/like-icon.svg'
                alt='Wallet Icon'
              />
              <Text fontSize='lg'>Delegated funds remain in your account</Text>
            </Flex>
            <Flex
              display={['none', null, 'flex']}
              py='18px'
              mb='30px'
              borderY='1px solid #EDF2F7'
              gap={2}
            >
              <Image
                maxW='110px'
                src='/images/cool-icon.svg'
                alt='Wallet Icon'
              />
              <Text fontSize='lg'>Spend your tez at any time</Text>
            </Flex>
            <Flex
              flexDir={['column', null, 'row']}
              py='18px'
              mb='30px'
              gap='30px'
            >
              <Flex alignItems='center' justifyContent='space-between' gap={2}>
                <Flex justifyContent='center' alignItems='center' gap='6px'>
                  <Image
                    maxW='110px'
                    src='/images/error-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text pr='8px' color='gray.600' fontSize={['sm', null, 'md']}>
                    Risk
                  </Text>
                </Flex>

                <Flex gap='4px'>
                  <Box w='24px' h='6px' bg='gray.200' borderRadius='100px' />
                  <Box w='24px' h='6px' bg='gray.200' borderRadius='100px' />
                  <Box w='24px' h='6px' bg='gray.200' borderRadius='100px' />
                </Flex>
              </Flex>
              <Flex alignItems='center' justifyContent='space-between' gap={2}>
                <Flex justifyContent='center' alignItems='center' gap='6px'>
                  <Image
                    maxW='110px'
                    src='/images/trophy-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text pr='8px' color='gray.600' fontSize={['sm', null, 'md']}>
                    Reward
                  </Text>
                </Flex>
                <Flex gap='4px'>
                  <Box w='24px' h='6px' bg='#38A169' borderRadius='100px' />
                  <Box w='24px' h='6px' bg='gray.200' borderRadius='100px' />
                  <Box w='24px' h='6px' bg='gray.200' borderRadius='100px' />
                </Flex>
              </Flex>
            </Flex>
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
                href='/faqs/#delegating'
                // hideExternalLinkIcon={true}
                variant='secondary'
                w='full'
              >
                Learn More
              </Button>
            </Flex>
          </Flex>
          <Flex
            bg='white'
            boxShadow='0px 2px 12px 0px rgba(20, 20, 43, 0.08)'
            textAlign={'center'}
            flexDir='column'
            position='relative'
            zIndex={1}
            flex={1}
            borderRadius='16px'
            py={['24px', null, '40px']}
            px={['24px', null, null, null, '48px']}
          >
            <Heading
              as='h1'
              fontSize='2xl'
              fontFamily='Inter, sans-serif'
              color='gray.900'
              textAlign='left'
              fontWeight={600}
              pb='16px'
            >
              Stake
            </Heading>
            <Text
              textAlign='left'
              as='h2'
              fontSize={['sm', null, 'lg']}
              color={'gray.600'}
              pb={['0px', null, '24px']}
            >
              Earn higher rewards by staking
            </Text>
            <Flex
              display={['none', null, 'flex']}
              py='18px'
              borderTop='1px solid #EDF2F7'
              gap={2}
            >
              <Image
                maxW='110px'
                src='/images/pie-chart-icon.svg'
                alt='Wallet Icon'
              />
              <Text fontSize='lg'>Stake however much tez you'd like</Text>
            </Flex>
            <Flex
              display={['none', null, 'flex']}
              py='18px'
              borderTop='1px solid #EDF2F7'
              gap={2}
            >
              <Image
                maxW='110px'
                src='/images/lock-icon.svg'
                alt='Wallet Icon'
              />
              <Text fontSize='lg'>Staked funds are locked in your account</Text>
            </Flex>
            <Flex
              display={['none', null, 'flex']}
              py='18px'
              mb='30px'
              borderY='1px solid #EDF2F7'
              gap={2}
            >
              <Image
                maxW='110px'
                src='/images/analyse-icon.svg'
                alt='Wallet Icon'
              />
              <Text fontSize='lg'>Approximately 10 days for unstaking</Text>
            </Flex>
            <Flex
              flexDir={['column', null, 'row']}
              py='18px'
              mb='30px'
              gap='30px'
            >
              <Flex alignItems='center' justifyContent='space-between' gap={2}>
                <Flex justifyContent='center' alignItems='center' gap='6px'>
                  <Image
                    maxW='110px'
                    src='/images/error-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text pr='8px' color='gray.600' fontSize={['sm', null, 'md']}>
                    Risk
                  </Text>
                </Flex>
                <Flex gap='4px'>
                  <Box w='24px' h='6px' bg='#E53E3E' borderRadius='100px' />
                  <Box w='24px' h='6px' bg='gray.200' borderRadius='100px' />
                  <Box w='24px' h='6px' bg='gray.200' borderRadius='100px' />
                </Flex>
              </Flex>
              <Flex alignItems='center' justifyContent='space-between' gap={2}>
                <Flex justifyContent='center' alignItems='center' gap='6px'>
                  <Image
                    maxW='110px'
                    src='/images/trophy-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text pr='8px' color='gray.600' fontSize={['sm', null, 'md']}>
                    Reward
                  </Text>
                </Flex>
                <Flex gap='4px'>
                  <Box w='24px' h='6px' bg='#38A169' borderRadius='100px' />
                  <Box w='24px' h='6px' bg='#38A169' borderRadius='100px' />
                  <Box w='24px' h='6px' bg='#38A169' borderRadius='100px' />
                </Flex>
              </Flex>
            </Flex>
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
                href='/faqs/#staking'
                variant='secondary'
                w='full'
              >
                Learn More
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

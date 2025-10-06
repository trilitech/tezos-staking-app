import { Box, Heading, Text, Flex, Separator, Image } from '@chakra-ui/react'
import { Header } from './Header'
import { useConnection } from '@/providers/ConnectionProvider'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'
import { CustomButton } from './buttons/CustomButton'

export default function Hero() {
  const { connect } = useConnection()

  return (
    <Box
      w='100%'
      backgroundSize='cover'
      backgroundBlendMode='multiply'
      bg="linear-gradient(90deg, #6C235E 0%, #5C72FA 100%), url('/images/hero-pattern.png')"
      // px={['24px', null, '40px']}
    >
      <Box px={['24px', null, '40px']}>
        <Header />
      </Box>
      <Flex
        backgroundSize='contain'
        backgroundBlendMode='multiply'
        bg="linear-gradient(90deg, #6C235E 0%, #5C72FA 100%), url('/images/hero-pattern.png')"
        w='full'
        px={6}
      >
        <Flex
          borderRadius={[0, null, null, '4px']}
          zIndex={1}
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
                • &nbsp;Staking Version 2.0 is here
              </Text>
              <Heading
                as='h1'
                fontSize={['44px', null, '60px']}
                fontFamily='Inter, sans-serif'
                lineHeight={['54px', null, '66px']}
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
                Tezos&apos; proof-of-stake mechanism.
              </Text>
              <Flex
                w='full'
                direction={['column', 'row']}
                gap={[2, 3]}
                align={'center'}
                alignSelf={['center', 'start']}
                position={'relative'}
              >
                <CustomButton
                  scrollPadding={80}
                  scrollMarginBottom={70}
                  w={['full', null, '180px']}
                  onClick={() => {
                    trackGAEvent(GAAction.BUTTON_CLICK, GACategory.WALLET_BEGIN)
                    connect()
                  }}
                  variant='primary'
                >
                  Start Earning
                </CustomButton>
                <CustomButton
                  w={['full', null, '180px']}
                  onClick={() => {
                    window.open(
                      'https://docs.tezos.com/using/staking',
                      '_blank'
                    )
                  }}
                  variant='altSecondary'
                >
                  Learn More
                </CustomButton>
              </Flex>
              <Separator
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

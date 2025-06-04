import { useRef } from 'react'
import {
  Box,
  Text,
  Flex,
  Image,
  Tabs,
  useBreakpointValue
} from '@chakra-ui/react'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'

export default function DashboardInfo() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [translateX, setTranslateX] = useState(0)

  const isBase = useBreakpointValue({ base: true, md: false })

  const tabTexts = [
    {
      title: 'Connect your wallet',
      description:
        'Link your own wallet or choose from a variety of supported wallet options to easily create one in just a few clicks.'
    },
    {
      title: 'Select your baker',
      description:
        'Choose from a diverse range of trusted bakers on Tezos to delegate or stake with, using a range of metrics to help you make the right choice for you.'
    },
    {
      title: 'Manage your staking',
      description:
        'Easily switch between delegating, staking, and managing your tez all within one simple interface.'
    }
  ]

  const tabImages = [
    '/images/MediaCards1.png',
    '/images/MediaCards2.png',
    '/images/MediaCards3.png'
  ]

  const handleSwipeStart = () => {
    setTranslateX(0)
  }

  const translateXRef = useRef(0)

  const handleSwipeMove = (data: { deltaX: number }) => {
    translateXRef.current = data.deltaX
    setTranslateX(data.deltaX)
  }

  const handleSwipeEnd = (data: { velocity: number; deltaX: number }) => {
    const threshold = 50
    const velocityThreshold = 0.3

    if (
      data.deltaX > threshold ||
      (data.velocity > velocityThreshold && data.deltaX > 0)
    ) {
      setActiveIndex(prevIndex => Math.max(0, prevIndex - 1))
    } else if (
      data.deltaX < -threshold ||
      (data.velocity > velocityThreshold && data.deltaX < 0)
    ) {
      setActiveIndex(prevIndex => Math.min(tabTexts.length - 1, prevIndex + 1))
    }

    // Smooth transition instead of instant reset
    setTranslateX(0)
    translateXRef.current = 0
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeEnd,
    onSwipedRight: handleSwipeEnd,
    onSwiping: handleSwipeMove,
    onSwipeStart: handleSwipeStart,
    trackMouse: true
  })

  return (
    <>
      <Flex px={[0, null, 6]} bg='#F0F0FF' w='full'>
        <Box
          borderRadius={[0, null, null, '4px']}
          mt={[null, null, null, '84px']}
          overflow='hidden'
          pos='relative'
          zIndex={1}
          maxW='1232px'
          w='100%'
          mx='auto'
        >
          <Flex flexDir='column' w='100%' py='48px'>
            <Box px='24px' pb='36px' w='100%' textAlign='center'>
              <Text
                pb='12px'
                fontSize={['4xl', null, '5xl']}
                lineHeight={['42px', null, '64px']}
                fontWeight={600}
              >
                Get to know your dashboard
              </Text>
              <Text color='gray.600' fontSize={['md', null, 'lg']}>
                Effortless staking at your fingertips—explore how the dashboard
                simplifies every step
              </Text>
            </Box>

            {isBase ? (
              <>
                <Flex
                  {...swipeHandlers}
                  w='100%'
                  overflow='hidden'
                  position='relative'
                  textAlign='center'
                  userSelect='none'
                >
                  <Flex
                    flexDir='row'
                    style={{
                      transform: `translateX(calc(-${activeIndex * 100}% + ${translateX}px))`,
                      transition:
                        translateX === 0 ? 'transform 0.3s ease-out' : 'none' // Smooth transition only after swipe ends
                    }}
                    w={`${tabTexts.length * 100}%`}
                  >
                    {tabTexts.map((text, index) => (
                      <Flex
                        transform='scale(0.9)'
                        key={index}
                        bg='white'
                        borderRadius='24px'
                        justifyContent={['start', null, 'center']}
                        alignItems='start'
                        flexDir='column'
                        p={['24px', null, '48px']}
                        textAlign='left'
                        boxShadow='customShadow'
                        w='100%'
                        flex='0 0 100%'
                        h='192px'
                      >
                        <Text fontSize='24px' fontWeight='bold'>
                          {text.title}
                        </Text>
                        <Text fontSize='sm' color='gray.600'>
                          {text.description}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>

                <Flex
                  w='100%'
                  justifyContent='center'
                  alignItems='center'
                  gap='16px'
                  mt='24px'
                  px={['48px', '24px']}
                >
                  {tabTexts.map((_, index) => (
                    <Box
                      key={index}
                      flex={1}
                      h='6px'
                      bg={activeIndex === index ? 'blue' : 'white'}
                      borderRadius='100px'
                      cursor='pointer'
                      onClick={() => setActiveIndex(index)}
                    ></Box>
                  ))}
                </Flex>
              </>
            ) : (
              <>
                <Flex w='100%' justifyContent='center'>
                  <Tabs.Root
                    backgroundColor='white'
                    colorScheme='gray'
                    bg='transparent'
                    w='fit-content'
                    onValueChange={e => setActiveIndex(Number(e.value))}
                  >
                    <Tabs.List
                      borderRadius='12px'
                      bg='white'
                      p='6px'
                      border='1px solid white'
                    >
                      <CustomTab
                        text='Connect'
                        onClick={() => setActiveIndex(0)}
                        isSelected={activeIndex === 0}
                      />
                      <Box
                        mx='12px'
                        my='auto'
                        bg='gray.200'
                        borderRadius='100px'
                        h='12px'
                        w='2px'
                      />
                      <CustomTab
                        text='Select'
                        onClick={() => setActiveIndex(1)}
                        isSelected={activeIndex === 1}
                      />
                      <Box
                        mx='12px'
                        my='auto'
                        bg='gray.200'
                        borderRadius='100px'
                        h='12px'
                        w='2px'
                      />
                      <CustomTab
                        text='Manage'
                        onClick={() => setActiveIndex(2)}
                        isSelected={activeIndex === 2}
                      />
                    </Tabs.List>
                  </Tabs.Root>
                </Flex>

                <Flex
                  w='100%'
                  position='relative'
                  bgSize='contain'
                  bgRepeat='no-repeat'
                  zIndex={0}
                  borderRadius='4px'
                  py={['24px', null, '48px']}
                  gap={['43px', '80px']}
                >
                  <Flex
                    textAlign='center'
                    flexDir='column'
                    position='relative'
                    zIndex={1}
                    w='50%'
                    borderRadius='16px'
                  >
                    <Flex gap='40px' w='100%' h='100%' flexDir='row'>
                      <Flex my='16px' gap='16px' w='6px' flexDir='column'>
                        <Box
                          borderRadius='100px'
                          flex='1'
                          bg={activeIndex === 0 ? 'blue' : 'white'}
                        ></Box>
                        <Box
                          borderRadius='100px'
                          flex='1'
                          bg={activeIndex === 1 ? 'blue' : 'white'}
                        ></Box>
                        <Box
                          borderRadius='100px'
                          flex='1'
                          bg={activeIndex === 2 ? 'blue' : 'white'}
                        ></Box>
                      </Flex>

                      <Flex flex='1' flexDir='column' gap='16px' h='409px'>
                        {[
                          tabTexts[activeIndex],
                          tabTexts[(activeIndex + 1) % tabTexts.length]
                        ].map((text, index) => (
                          <Flex
                            h='192px'
                            flex={1}
                            key={index}
                            bg='white'
                            onClick={() =>
                              setActiveIndex(
                                activeIndex === 2 ? 0 : activeIndex + 1
                              )
                            }
                            filter={index === 1 ? 'blur(4px)' : ''}
                            borderRadius='24px'
                            justifyContent='start'
                            gap='12px'
                            alignItems='start'
                            flexDir='column'
                            p={['24px', null, '48px']}
                            textAlign='left'
                            boxShadow='customShadow'
                          >
                            <Text fontSize='2xl' fontWeight='bold'>
                              {text.title}
                            </Text>
                            <Text fontSize='sm' color='gray.600'>
                              {text.description}
                            </Text>
                          </Flex>
                        ))}
                      </Flex>
                    </Flex>
                  </Flex>
                  <Flex
                    bg='gray.300'
                    textAlign={'center'}
                    flexDir='column'
                    position='relative'
                    zIndex={1}
                    w='50%'
                    height='400px'
                    borderRadius='24px'
                    py='40px'
                    px='48px'
                    overflow='hidden'
                  >
                    <Image
                      src={tabImages[activeIndex]}
                      alt='Tutorial connect'
                      objectFit='cover'
                      position='absolute'
                      top='0'
                      left='0'
                      width='100%'
                      height='100%'
                      borderRadius='16px'
                      zIndex={-1}
                    />
                  </Flex>
                </Flex>
              </>
            )}
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

const CustomTab = ({
  text,
  onClick,
  isSelected
}: {
  text: string
  onClick: () => void
  isSelected: boolean
}) => {
  return (
    <Box
      fontSize='lg'
      px='12px'
      py='6px'
      borderRadius='8px'
      bg={isSelected ? '#edf2f6' : ''}
      _hover={{ bg: '#edf2f6', cursor: 'pointer' }}
      onClick={onClick}
      fontWeight={600}
    >
      {text}
    </Box>
  )
}

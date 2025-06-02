import React, { useState } from 'react'
import { Accordion, Box, Text, Table, Flex, Image } from '@chakra-ui/react'
import { BakerInfo } from './Operations/tezInterfaces'
import { mutezToTez } from '@/utils/mutezToTez'

export const ExpandBakerInfoTable = ({ baker }: { baker?: BakerInfo }) => {
  const [isToggle, setIsToggle] = useState(false)

  return (
    <Accordion.Root
      collapsible
      w='100%'
      borderBottom='0px solid transparent'
      onValueChange={details => setIsToggle(details.value.length > 0)}
    >
      <Accordion.Item px={0} py={0} w='100%' value='baker-info'>
        <Accordion.ItemTrigger
          _hover={{ bg: 'transparent', cursor: 'pointer' }}
          py='20px'
          px={0}
        >
          <Box as='span' flex='1' textAlign='left'>
            <Text
              fontSize='14px'
              fontWeight={600}
              lineHeight='18px'
              color='gray.600'
            >
              BAKER’S INFO
            </Text>
          </Box>
          <Flex alignItems='center'>
            <Text
              fontSize='14px'
              fontWeight={600}
              lineHeight='18px'
              color='gray.600'
            >
              {isToggle ? 'See Less' : 'See More'}
            </Text>
            <Accordion.ItemIndicator
              color='gray.400'
              width='18px'
              height='18px'
            />
          </Flex>
        </Accordion.ItemTrigger>

        <Accordion.ItemContent py={0} px={0}>
          <Table.Root borderRadius='8px' whiteSpace='wrap'>
            <Table.Body>
              <Table.Row bg='gray.100'>
                <Table.Cell
                  borderBottom='1px solid #E2E8F0'
                  px='24px'
                  py='16px'
                >
                  <Flex alignItems='center' gap='5px'>
                    <Text
                      w='max-content'
                      fontSize='14px'
                      fontWeight={600}
                      lineHeight='22px'
                      color='gray.600'
                    >
                      TOTAL:
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell borderBottom='1px solid #E2E8F0' w='100%'>
                  <Flex justifyContent='flex-end' alignItems='end' gap='4px'>
                    <Text
                      display='inline-flex'
                      gap={1}
                      alignItems='center'
                      fontSize='14px'
                      fontWeight={600}
                      color='gray.900'
                    >
                      {Math.floor(mutezToTez(baker?.totalStakedBalance ?? 0))}{' '}
                      <Image
                        mt='4px'
                        h='14px'
                        src='/images/T3.svg'
                        alt='Tezos Logo'
                      />
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>

              <Table.Row bg='gray.100'>
                <Table.Cell
                  borderBottom='1px solid #E2E8F0'
                  px='24px'
                  py='16px'
                >
                  <Flex alignItems='center' gap='5px'>
                    <Text
                      w='max-content'
                      fontSize='14px'
                      fontWeight={600}
                      lineHeight='22px'
                      color='gray.600'
                    >
                      FEE:
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell borderBottom='1px solid #E2E8F0'>
                  <Flex
                    justifyContent='flex-end'
                    alignItems='center'
                    gap='4px'
                    w='100%'
                  >
                    <Text fontSize='14px' fontWeight={600} color='gray.900'>
                      {baker?.stakingFees}%
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>

              <Table.Row bg='gray.100'>
                <Table.Cell
                  px='24px'
                  py='16px'
                  borderBottom='1px solid #E2E8F0'
                >
                  <Flex alignItems='center' gap='5px'>
                    <Text
                      w='max-content'
                      fontSize='14px'
                      fontWeight={600}
                      lineHeight='22px'
                      color='gray.600'
                    >
                      FREE SPACE:
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell w='100%' borderBottom='1px solid #E2E8F0'>
                  <Flex justifyContent='flex-end' alignItems='center' gap='4px'>
                    <Text
                      display='inline-flex'
                      gap={1}
                      alignItems='center'
                      fontSize='14px'
                      fontWeight={600}
                      color='gray.900'
                    >
                      {Math.floor(baker?.stakingFreeSpace ?? 0)}
                      <Image
                        mt='4px'
                        h='14px'
                        src='/images/T3.svg'
                        alt='Tezos Logo'
                      />
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}

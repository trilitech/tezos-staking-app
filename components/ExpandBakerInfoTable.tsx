import React, { useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Flex,
  Image
} from '@chakra-ui/react'
import { BakerInfo } from './Operations/tezInterfaces'
import { mutezToTez } from '@/utils/mutezToTez'

export const ExpandBakerInfoTable = ({ baker }: { baker?: BakerInfo }) => {
  const [isToggle, setIsToggle] = useState(false)

  return (
    <Accordion
      borderBottom='0px solid transparent'
      w='100%'
      allowToggle
      onChange={() => setIsToggle(!isToggle)}
    >
      <AccordionItem px={0} py={0} w='100%'>
        <AccordionButton _hover={{ bg: 'transparent' }} py='20px' px={0}>
          <Box as='span' flex='1' textAlign='left'>
            <Text
              fontSize='14px'
              fontWeight={600}
              lineHeight='18px'
              color='gray.600'
            >
              BAKER&#39;S INFO
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
            <AccordionIcon color='gray.400' w='18px' h='18px' />
          </Flex>
        </AccordionButton>

        <AccordionPanel py={0} px={0}>
          <TableContainer bg='gray.100' borderRadius='8px' whiteSpace='wrap'>
            <Table>
              <Tbody>
                <Tr>
                  <Td borderBottom='1px solid #E2E8F0'>
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
                  </Td>
                  <Td borderBottom='1px solid #E2E8F0' w='100%'>
                    <Flex justifyContent='flex-end' alignItems='end' gap='4px'>
                      <Text display='inline-flex' gap={1} alignItems='center' fontSize='14px' fontWeight={600} color='gray.900'>
                        {Math.floor(mutezToTez(baker?.totalStakedBalance ?? 0))}{' '}
                        <Image mt='4px' h='14px' src='/images/T3.svg' alt='Tezos Logo' />
                      </Text>
                    </Flex>
                  </Td>
                </Tr>

                <Tr>
                  <Td borderBottom='1px solid #E2E8F0'>
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
                  </Td>
                  <Td borderBottom='1px solid #E2E8F0'>
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
                  </Td>
                </Tr>
                <Tr>
                  <Td>
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
                  </Td>
                  <Td w='100%'>
                    <Flex
                      justifyContent='flex-end'
                      alignItems='center'
                      gap='4px'
                    >
                      <Text display='inline-flex' gap={1} alignItems='center' fontSize='14px' fontWeight={600} color='gray.900'>
                        {Math.floor(baker?.stakingFreeSpace ?? 0)}
                        <Image mt='4px' h='14px' src='/images/T3.svg' alt='Tezos Logo' />
                      </Text>
                    </Flex>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

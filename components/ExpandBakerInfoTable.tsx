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
  Flex
} from '@chakra-ui/react'
import { BakerInfo } from './Operations/tezInterfaces'

export const ExpandBakerInfoTable = ({ baker }: { baker?: BakerInfo }) => {
  const [isToggle, setIsToggle] = useState(true)

  return (
    <Accordion
      borderBottom='0px solid transparent'
      w='100%'
      defaultIndex={0}
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
              color='#4A5568'
            >
              BAKER&#39;S INFO
            </Text>
          </Box>
          <Flex alignItems='center'>
            <Text
              fontSize='14px'
              fontWeight={600}
              lineHeight='18px'
              color='#4A5568'
            >
              {isToggle ? 'See Less' : 'See More'}
            </Text>
            <AccordionIcon color='#A0AEC0' w='18px' h='18px' />
          </Flex>
        </AccordionButton>

        <AccordionPanel py={0} px={0}>
          <TableContainer bg='#EDF2F7' borderRadius='8px' whiteSpace='wrap'>
            <Table>
              <Tbody>
                <Tr>
                  <Td borderBottom='1px solid #E2E8F0'>
                    <Flex alignItems='center' gap='5px'>
                      <Text
                        fontSize='14px'
                        fontWeight={600}
                        lineHeight='22px'
                        color='#4A5568'
                      >
                        STAKING:
                      </Text>
                    </Flex>
                  </Td>
                  <Td borderBottom='1px solid #E2E8F0' w='100%'>
                    <Flex alignItems='center' gap='4px'>
                      <Text fontSize='14px' fontWeight={600} color='#171923'>
                        {baker?.totalStakedBalance} ꜩ
                      </Text>
                    </Flex>
                  </Td>
                </Tr>
                <Tr>
                  <Td borderBottom='1px solid #E2E8F0'>
                    <Flex alignItems='center' gap='5px'>
                      <Text
                        fontSize='14px'
                        fontWeight={600}
                        lineHeight='22px'
                        color='#4A5568'
                      >
                        FREE SPACE:
                      </Text>
                    </Flex>
                  </Td>
                  <Td borderBottom='1px solid #E2E8F0' w='100%'>
                    <Flex alignItems='center' gap='4px'>
                      <Text fontSize='14px' fontWeight={600} color='#171923'>
                        {Math.floor(baker?.stakingFreeSpace ?? 0)} ꜩ
                      </Text>
                    </Flex>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Flex alignItems='center' gap='5px'>
                      <Text
                        fontSize='14px'
                        fontWeight={600}
                        lineHeight='22px'
                        color='#4A5568'
                      >
                        FEE:
                      </Text>
                    </Flex>
                  </Td>
                  <Td>
                    <Flex alignItems='center' gap='4px' w='100%'>
                      <Text fontSize='14px' fontWeight={600} color='#171923'>
                        {baker?.stakingFees}%
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

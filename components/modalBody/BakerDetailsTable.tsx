import React from 'react'
import {
  Flex,
  Text,
  Image,
  FlexProps,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer
} from '@chakra-ui/react'
import { simplifyAddress } from '@/utils/simpliftAddress'
import useClipboard from '@/utils/useClipboard'
import { CopyAlert } from '../CopyAlert'

interface BakerDetailsTableProps {
  alias: string
  address: string
  fee: number
  acceptStaking: boolean
  capacity: number
}

export const BakerDetailsTable = ({
  alias,
  address,
  fee,
  acceptStaking,
  capacity
}: BakerDetailsTableProps & FlexProps) => {
  const { isCopied, copyTextToClipboard } = useClipboard()

  return (
    <>
      {isCopied && <CopyAlert />}
      <TableContainer bg='#EDF2F7' borderRadius='8px' p='16px' mb='30px'>
        <Table>
          <Tbody>
            <Tr>
              <Td borderBottom='1px solid #E2E8F0'>
                <Flex alignItems='center' gap='5px'>
                  <Image
                    w='30px'
                    h='30px'
                    src={`${process.env.NEXT_PUBLIC_TZKT_AVATARS_URL}/${address}`}
                    alt='baker avatar'
                  />
                  <Text
                    fontSize='16px'
                    fontWeight={600}
                    lineHeight='22px'
                    color='#4A5568'
                  >
                    {alias ?? 'Private Baker'}
                  </Text>
                </Flex>
              </Td>
              <Td borderBottom='1px solid #E2E8F0'>
                <Flex alignItems='center' gap='4px'>
                  <Text fontSize='14px' fontWeight={400} color='#2D3748'>
                    {simplifyAddress(address)}
                  </Text>
                  <Image
                    w='18px'
                    h='18px'
                    color='#A0AEC0'
                    _hover={{ cursor: 'pointer' }}
                    src='/images/copy-icon.svg'
                    alt='copy icon'
                    onClick={() => copyTextToClipboard(address)}
                  />
                </Flex>
              </Td>
            </Tr>
            <Tr>
              <Td borderBottom='1px solid #E2E8F0'>
                <Text
                  color='#4A5568'
                  fontSize='14px'
                  textTransform='uppercase'
                  fontWeight={600}
                >
                  Delegation Fee:
                </Text>
              </Td>
              <Td borderBottom='1px solid #E2E8F0'>
                <Text color='#10121B' fontWeight={600} fontSize='14px'>
                  {fee ?? 0}%
                </Text>
              </Td>
            </Tr>
            <Tr>
              <Td borderBottom='1px solid #E2E8F0'>
                <Text
                  color='#4A5568'
                  fontSize='14px'
                  textTransform='uppercase'
                  fontWeight={600}
                >
                  Accepts Staking:
                </Text>
              </Td>
              <Td borderBottom='1px solid #E2E8F0'>
                <Text color='#10121B' fontWeight={600} fontSize='14px'>
                  {acceptStaking ? 'Yes' : 'No'}
                </Text>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Text
                  color='#4A5568'
                  fontSize='14px'
                  textTransform='uppercase'
                  fontWeight={600}
                >
                  Remaining Capacity:
                </Text>
              </Td>
              <Td>
                <Text
                  color='#10121B'
                  fontWeight={600}
                  fontSize='14px'
                  justifySelf='start'
                >
                  {Math.floor(capacity) ?? 0} ꜩ
                </Text>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}

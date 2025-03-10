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
import { BakerInfo } from '../Operations/tezInterfaces'
import { mutezToTez } from '@/utils/mutezToTez'
interface BakerDetailsTableProps {
  baker: BakerInfo
}

export const BakerDetailsTable = ({
  baker
}: BakerDetailsTableProps & FlexProps) => {
  const { isCopied, copyTextToClipboard } = useClipboard()

  return (
    <>
      {isCopied && <CopyAlert />}
      <TableContainer
        bg='gray.100'
        borderRadius='8px'
        mb='30px'
        whiteSpace='wrap'
      >
        <Table>
          <Tbody>
            <Tr>
              <Td borderBottom='1px solid #E2E8F0' pl={[3, 4]} pr={[0, 4]}>
                <Flex alignItems='center' gap='6px'>
                  <Image
                    w='30px'
                    h='30px'
                    src={`${process.env.NEXT_PUBLIC_TZKT_AVATARS_URL}/${baker.address}`}
                    alt='baker avatar'
                  />
                  <Text
                    fontSize='14px'
                    fontWeight={600}
                    lineHeight='22px'
                    color='gray.600'
                  >
                    {baker.alias ?? 'Private Baker'}
                  </Text>
                </Flex>
              </Td>
              <Td borderBottom='1px solid #E2E8F0' px={[3, 4]}>
                <Flex alignItems='center' justifyContent='end' gap='4px'>
                  <Text fontSize='14px' fontWeight={400} color='gray.700'>
                    {simplifyAddress(baker.address)}
                  </Text>
                  <Image
                    w='18px'
                    h='18px'
                    color='gray.400'
                    _hover={{ cursor: 'pointer' }}
                    src='/images/copy-icon.svg'
                    alt='copy icon'
                    onClick={() => copyTextToClipboard(baker.address)}
                  />
                </Flex>
              </Td>
            </Tr>
            <Tr>
              <Td borderBottom='1px solid #E2E8F0' px={[3, 4]} pr={[0, 4]}>
                <Text
                  color='gray.600'
                  fontSize='14px'
                  textTransform='uppercase'
                  fontWeight={600}
                >
                  TOTAL:
                </Text>
              </Td>
              <Td textAlign='end' borderBottom='1px solid #E2E8F0' px={[3, 4]}>
                <Text
                  textAlign='end'
                  display='inline-flex' gap={1} alignItems='center'
                  color='#10121B'
                  fontWeight={600}
                  fontSize='14px'
                >
                  {Math.floor(mutezToTez(baker.totalStakedBalance))}
                  <Image mt='4px' h='14px' src='/images/T3.svg' alt='Tezos Logo' />
                </Text>
              </Td>
            </Tr>
            <Tr>
              <Td borderBottom='1px solid #E2E8F0' px={[3, 4]} pr={[0, 4]}>
                <Text
                  color='gray.600'
                  fontSize='14px'
                  textTransform='uppercase'
                  fontWeight={600}
                >
                  FEE:
                </Text>
              </Td>
              <Td textAlign='end' borderBottom='1px solid #E2E8F0' px={[3, 4]}>
                <Text
                  textAlign='end'
                  color='#10121B'
                  fontWeight={600}
                  fontSize='14px'
                >
                  {baker.stakingFees} %
                </Text>
              </Td>
            </Tr>
            <Tr>
              <Td px={[3, 4]} pr={[0, 4]}>
                <Text
                  color='gray.600'
                  fontSize='14px'
                  textTransform='uppercase'
                  fontWeight={600}
                >
                  FREE SPACE:
                </Text>
              </Td>
              <Td textAlign='end' px={[3, 4]}>
                <Text
                  display='inline-flex' gap={1} alignItems='center'
                  textAlign='end'
                  color='#10121B'
                  fontWeight={600}
                  fontSize='14px'
                >
                  {Math.floor(baker.stakingFreeSpace)}
                  <Image mt='4px' h='14px' src='/images/T3.svg' alt='Tezos Logo' />
                </Text>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}

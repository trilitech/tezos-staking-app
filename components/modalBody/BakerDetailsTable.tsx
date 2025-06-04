import React from 'react'
import { Flex, Text, Image, FlexProps, Table } from '@chakra-ui/react'
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

      <Table.Root borderRadius='8px' mb='30px' whiteSpace='wrap'>
        <Table.Body>
          <Table.Row bg='gray.100'>
            <Table.Cell
              borderBottom='1px solid #E2E8F0'
              pl={[3, 4]}
              pr={[0, 4]}
              py='16px'
            >
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
            </Table.Cell>
            <Table.Cell borderBottom='1px solid #E2E8F0' px={[3, 4]}>
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
            </Table.Cell>
          </Table.Row>
          <Table.Row bg='gray.100'>
            <Table.Cell
              borderBottom='1px solid #E2E8F0'
              py='16px'
              px={[3, 4]}
              pr={[0, 4]}
            >
              <Text
                color='gray.600'
                fontSize='14px'
                textTransform='uppercase'
                fontWeight={600}
              >
                TOTAL:
              </Text>
            </Table.Cell>
            <Table.Cell
              textAlign='end'
              borderBottom='1px solid #E2E8F0'
              px={[3, 4]}
            >
              <Text
                textAlign='end'
                display='inline-flex'
                gap={1}
                alignItems='center'
                color='#10121B'
                fontWeight={600}
                fontSize='14px'
              >
                {Math.floor(mutezToTez(baker.totalStakedBalance))}
                <Image
                  mt='4px'
                  h='14px'
                  src='/images/T3.svg'
                  alt='Tezos Logo'
                />
              </Text>
            </Table.Cell>
          </Table.Row>
          <Table.Row bg='gray.100'>
            <Table.Cell
              borderBottom='1px solid #E2E8F0'
              py='16px'
              px={[3, 4]}
              pr={[0, 4]}
            >
              <Text
                color='gray.600'
                fontSize='14px'
                textTransform='uppercase'
                fontWeight={600}
              >
                FEE:
              </Text>
            </Table.Cell>
            <Table.Cell
              textAlign='end'
              borderBottom='1px solid #E2E8F0'
              px={[3, 4]}
            >
              <Text
                textAlign='end'
                color='#10121B'
                fontWeight={600}
                fontSize='14px'
              >
                {baker.stakingFees} %
              </Text>
            </Table.Cell>
          </Table.Row>
          <Table.Row bg='gray.100'>
            <Table.Cell
              px={[3, 4]}
              pr={[0, 4]}
              py='16px'
              borderBottom='1px solid #E2E8F0'
            >
              <Text
                color='gray.600'
                fontSize='14px'
                textTransform='uppercase'
                fontWeight={600}
              >
                FREE SPACE:
              </Text>
            </Table.Cell>
            <Table.Cell
              textAlign='end'
              px={[3, 4]}
              borderBottom='1px solid #E2E8F0'
            >
              <Text
                display='inline-flex'
                gap={1}
                alignItems='center'
                textAlign='end'
                color='#10121B'
                fontWeight={600}
                fontSize='14px'
              >
                {Math.floor(baker.stakingFreeSpace)}
                <Image
                  mt='4px'
                  h='14px'
                  src='/images/T3.svg'
                  alt='Tezos Logo'
                />
              </Text>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </>
  )
}

'use client'
import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Center,
  Box,
  IconButton,
  Spinner,
  VStack
} from '@chakra-ui/react'

import { RepeatIcon } from '@chakra-ui/icons'

import { useState, useEffect } from 'react'
import { useConnection } from '@/components/ConnectionProvider'
import { ConnectButton } from '@/components/ConnectButton'
import { DisconnectButton } from '@/components/DisconnectButton'
import { fetchData } from './tezConnections'
import {
  BlockchainHead,
  StakingOpsStatus,
  UnstakedOperation,
  AccountInfo,
  BakerInfo
} from '@/app/tezInterfaces'

export default function Home() {
  const { isConnected, address } = useConnection()
  const [unstakedOps, setUnstakedOps] = useState<UnstakedOperation[]>(
    [] as UnstakedOperation[]
  )
  const [stakingOpsStatus, setStakingOpsStatus] = useState<StakingOpsStatus>({
    Delegated: false,
    CanStake: false,
    CanUnstake: false,
    CanFinalizeUnstake: false
  })
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [bakersList, setBakersList] = useState<BakerInfo[] | null>(null)

  useEffect(() => {
    if (isConnected) {
      fetchData(
        address,
        setAccountInfo,
        setUnstakedOps,
        setBakersList,
        stakingOpsStatus,
        setStakingOpsStatus
      )
    }
  }, [isConnected, address])

  return (
    <Box>
      {isConnected === undefined ? (
        <Spinner />
      ) : isConnected ? (
        <>
          <DisconnectButton />
          <Center>
            <VStack spacing='{4}'>
              <TableContainer maxW='80%'>
                <Table variant='simple'>
                  <TableCaption placement='top'>
                    Account Information
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Property</Th>
                      <Th>Value</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Account Name</Td>
                      <Td>{accountInfo?.alias}</Td>
                    </Tr>
                    <Tr>
                      <Td>Address</Td>
                      <Td>{accountInfo?.address}</Td>
                    </Tr>
                    <Tr>
                      <Td>Balance</Td>
                      <Td>{accountInfo?.balance}</Td>
                    </Tr>
                    <Tr>
                      <Td>StakedBalance</Td>
                      <Td>{accountInfo?.stakedBalance}</Td>
                    </Tr>
                    <Tr>
                      <Td>UnstakedBalance</Td>
                      <Td>{accountInfo?.unstakedBalance}</Td>
                    </Tr>
                    <Tr>
                      <Td>FrozenDeposit</Td>
                      <Td>{accountInfo?.frozenDeposit}</Td>
                    </Tr>
                    <Tr>
                      <Td>Delegate Selected:</Td>
                      <Td>
                        {accountInfo?.delegate === null
                          ? 'Delegate not selected'
                          : accountInfo?.delegate.active
                            ? 'Yes'
                            : 'No'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Delegate (Baker)</Td>
                      <Td>
                        {accountInfo?.delegate?.alias ?? 'No name assigned.'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Delegate Address</Td>
                      <Td>{accountInfo?.delegate?.address}</Td>
                    </Tr>
                  </Tbody>
                </Table>
                <IconButton
                  aria-label='Refresh'
                  icon={<RepeatIcon />}
                  onClick={() =>
                    fetchData(
                      address,
                      setAccountInfo,
                      setUnstakedOps,
                      setBakersList,
                      stakingOpsStatus,
                      setStakingOpsStatus
                    )
                  }
                />
              </TableContainer>
              <TableContainer maxW='80%'>
                <Table variant='simple'>
                  <TableCaption placement='top'>
                    Unstaked Operations Information
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Baker Alias</Th>
                      <Th>Baker Address</Th>
                      <Th>Staker Alias</Th>
                      <Th>Staker Address</Th>
                      <Th>Requested Amount</Th>
                      <Th>Finalized Amount</Th>
                      <Th>Slashed Amount</Th>
                      <Th>Last Operation Time</Th>
                      <Th>Time to Finalize</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {unstakedOps &&
                      unstakedOps.map((operation, index) => (
                        <Tr key={index}>
                          <Td>{operation.baker.alias}</Td>
                          <Td>{operation.baker.address}</Td>
                          <Td>{operation.staker.alias}</Td>
                          <Td>{operation.staker.address}</Td>
                          <Td>{operation.requestedAmount}</Td>
                          <Td>{operation.finalizedAmount}</Td>
                          <Td>{operation.slashedAmount}</Td>
                          <Td>{operation.lastTime}</Td>
                          <Td>{operation.timeToFinalizeInSec}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <TableContainer maxW='80%'>
                <Table variant='simple'>
                  <TableCaption placement='top'>Bakers List</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Alias</Th>
                      <Th>Address</Th>
                      <Th>Edge of Baking Over Staking</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {bakersList &&
                      bakersList.map((baker, index) => (
                        <Tr key={index}>
                          <Td>{baker.alias}</Td>
                          <Td>{baker.address}</Td>
                          <Td>
                            {baker.edgeOfBakingOverStaking / 1000000000.0}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          </Center>
        </>
      ) : (
        <ConnectButton />
      )}
    </Box>
  )
}

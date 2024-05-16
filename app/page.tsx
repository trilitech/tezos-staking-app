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
import {
  StakingOpsStatus,
  AccountInfo,
  BakersList,
  unstakedOperations,
  updateStakingOpsStatus,
  blockchainHead
} from './tezInterfaces'

export default function Home() {
  const { isConnected, address } = useConnection()
  const tzktBaseUrl = String('https://api.parisnet.tzkt.io')
  const bakersListApiUrl = tzktBaseUrl + '/v1/delegates/'
  const accountInfoApiUrl = tzktBaseUrl + '/v1/accounts/'
  const unstakedOpsApiUrl = tzktBaseUrl + '/v1/staking/unstake_requests?staker='
  const blockchainHeadApiUrl = tzktBaseUrl + '/v1/head'
  const [blockchainHead, setBlockchainHead] = useState<blockchainHead | null>(
    null
  )
  const [unstakedOps, setUnstakedOps] = useState<unstakedOperations[]>(
    [] as unstakedOperations[]
  )
  const [stakingOpsStatus, setStakingOpsStatus] = useState<StakingOpsStatus>({
    Delegated: false,
    CanStake: false,
    CanUnstake: false,
    CanFinalzeUnstake: false
  })
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [bakersList, setBakersList] = useState<BakersList[] | null>(null)

  const fetchBakerData = async () => {
    try {
      const response = await fetch(bakersListApiUrl)
      const data = await response.json()
      setBakersList(data)
    } catch (error) {
      window.alert(
        `Error fetching data from Tzkt API. Check api/address is correct. \nBakers List URL:${bakersListApiUrl}. Error: ${error}`
      )
    }
  }
  const fetchAccountData = async (address: string | undefined) => {
    try {
      const response = await fetch(blockchainHeadApiUrl)
      const data = await response.json()
      setBlockchainHead(data)
    } catch (error) {
      window.alert(
        `Error fetching data from Tzkt API. Check api/address is correct. \nBlockchain Head URL:${blockchainHeadApiUrl}. Error: ${error}`
      )
    }
    const accountInfoApiAddress = String(accountInfoApiUrl + address)
    try {
      const response = await fetch(accountInfoApiAddress)
      const data = await response.json()
      setAccountInfo(data)
    } catch (error) {
      window.alert(
        `Error fetching data from Tzkt API. Check api/address is correct. \nAccount Info URL:${accountInfoApiAddress}. Error: ${error}`
      )
    }
    const unstakedOpsApiAddress = String(unstakedOpsApiUrl + address)
    let unstakedOpsData
    try {
      const unstakedOpsResponse = await fetch(unstakedOpsApiAddress)
      unstakedOpsData = await unstakedOpsResponse.json()
    } catch (error) {
      window.alert(
        'Error fetching data from Tzkt API. Check api/address is correct. \n UnstakedOps URL:${unstakedOpsApiAddress}\nError: ${error}'
      )
    }
    if (accountInfo !== null && blockchainHead !== null) {
      let { opStatus, unstakingOps } = updateStakingOpsStatus(
        blockchainHead,
        accountInfo,
        unstakedOpsData,
        stakingOpsStatus
      )
      setStakingOpsStatus(opStatus)
      setUnstakedOps(unstakingOps)
    }
  }

  useEffect(() => {
    if (isConnected) {
      fetchAccountData(address)
      fetchBakerData()
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
                  onClick={() => fetchAccountData(address)}
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

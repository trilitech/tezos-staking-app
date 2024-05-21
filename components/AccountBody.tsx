import React, { useState, useEffect } from 'react'
import {
  Flex,
  Image,
  Text,
  Grid,
  useDisclosure,
  Link as ChakraLink
} from '@chakra-ui/react'
import Link from 'next/link'
import { DelegateData } from '../app/page'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { DelegationModal } from './Delegate/DelegationModal'
import {
  StakingOpsStatus,
  AccountInfo,
  UnstakedOperation
} from './Operations/tezInterfaces'
import { useConnection } from './ConnectionProvider'
import { simplifyAddress } from '@/utils/simpliftAddress'
import { PrimaryButton } from './buttons/PrimaryButton'
import { CloseIcon } from '@chakra-ui/icons'
import { OperationResult } from './Operations/operations'
import { ErrorModal } from './ErrorModal'
import { EndDelegationModal } from './EndDelegate/EndDelegateModal'
import { useFetchAccountData } from './Operations/tezConnections'
import { updateStakingOpsStatus } from './Operations/tezConnections'

export const AccountBody = ({
  balance,
  stakedBalance,
  unstakedBalance
}: DelegateData) => {
  const DelegateModal = useDisclosure()
  const EndDelegateModal = useDisclosure()
  const { address } = useConnection()

  const {
    blockchainHeadData,
    accountInfoData,
    unstakedOpsData,
    isLoading,
    error
  } = useFetchAccountData(address)

  const [errorMessage, setErrorMessage] = useState('')

  const [opResult, setOpResult] = useState<OperationResult | null>(null)
  const [stakingOpsStatus, setStakingOpsStatus] = useState<StakingOpsStatus>({
    Delegated: false,
    CanStake: false,
    CanUnstake: false,
    CanFinalizeUnstake: false
  })
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [unstakedOps, setUnstakedOps] = useState<UnstakedOperation[]>(
    [] as UnstakedOperation[]
  )

  useEffect(() => {
    if (!!errorMessage) setErrorMessage('')

    if (!opResult?.success && opResult?.success !== undefined) {
      setErrorMessage(opResult?.errorMessage as string)
      return
    }

    if (accountInfoData && blockchainHeadData) {
      const { opStatus, unstakingOps, totalFinalizableAmount } =
        updateStakingOpsStatus(
          blockchainHeadData,
          accountInfoData,
          unstakedOpsData,
          stakingOpsStatus
        )
      accountInfoData.totalFinalizableAmount = totalFinalizableAmount
      setAccountInfo(accountInfoData)
      setUnstakedOps(unstakingOps)
      setStakingOpsStatus(opStatus)
    }
  }, [blockchainHeadData, accountInfoData, unstakedOpsData, stakingOpsStatus])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <Flex
      flexDir='column'
      alignItems='center'
      justify='space-around'
      p='40px'
      borderRadius='16px'
      bg='#FFF'
      w='100%'
      gap={['30px', null, '40px']}
    >
      {!!errorMessage && <ErrorModal message={errorMessage} />}
      <Grid
        w='100%'
        templateColumns={['repeat(1, 1fr)', null, 'repeat(2, 1fr)']}
        gap='20px'
      >
        <Flex flexDir='column' borderTop='1px solid #EDF2F7' pt='20px'>
          <Text fontSize='14px' color='#4A5568'>
            AVAILABLE
          </Text>
          {balance && <Text>{balance} ꜩ</Text>}
        </Flex>
        <Flex flexDir='column' borderTop='1px solid #EDF2F7' pt='20px'>
          <Text fontSize='14px' color='#4A5568'>
            STAKED
          </Text>
          {stakedBalance && <Text>{stakedBalance} ꜩ</Text>}
        </Flex>
        <Flex flexDir='column' borderTop='1px solid #EDF2F7' pt='20px'>
          <Flex justify='space-between' alignItems='center'>
            <Text fontSize='14px' color='#4A5568'>
              DELEGATION
            </Text>
            {!!stakingOpsStatus.Delegated && (
              <Flex
                justify='center'
                alignItems='center'
                gap='5px'
                _hover={{ cursor: 'pointer' }}
                onClick={async () => {
                  EndDelegateModal.onOpen()
                }}
              >
                <Text fontSize='14px'>End </Text>
                <CloseIcon fontSize='10px' />
              </Flex>
            )}
          </Flex>
          <Flex alignItems='center' gap='5px'>
            {!!stakingOpsStatus.Delegated ? (
              <Image src='/images/active-icon.svg' alt='active icon' />
            ) : (
              <Image src='/images/inactive-icon.svg' alt='inactive icon' />
            )}
            <Text>{!!stakingOpsStatus.Delegated ? 'Active ' : 'Inactive'}</Text>
          </Flex>
        </Flex>
        <Flex flexDir='column' borderTop='1px solid #EDF2F7' pt='20px'>
          <Flex justify='space-between' alignItems='center'>
            <Text fontSize='14px' color='#4A5568'>
              BAKER
            </Text>
            <ChakraLink
              as={Link}
              href='https://parisnet.tzkt.io/bakers'
              target='_blank'
              display='flex'
              alignItems='center'
              gap='5px'
              _hover={{
                cursor: 'pointer'
              }}
            >
              <Text fontSize='14px'>View bakers</Text>
              <ExternalLinkIcon />
            </ChakraLink>
          </Flex>
          <Text>
            {!!accountInfo?.delegate?.address
              ? simplifyAddress(accountInfo.delegate.address)
              : '--'}
          </Text>
        </Flex>
      </Grid>

      <Flex w='100%' gap='20px'>
        <PrimaryButton
          disabled={!!stakingOpsStatus.Delegated}
          onClick={() => {
            if (!stakingOpsStatus.Delegated) DelegateModal.onOpen()
            else return // open stake modal
          }}
          w='100%'
        >
          {!!stakingOpsStatus.Delegated ? 'Unstake' : 'Delegate'}
        </PrimaryButton>
        {/* TODO: implement this */}
        <PrimaryButton
          disabled={!stakingOpsStatus.Delegated}
          onClick={() => {
            console.log('click')
          }}
          w='100%'
        >
          Stake
        </PrimaryButton>
      </Flex>

      <DelegationModal
        isOpen={DelegateModal.isOpen}
        onClose={DelegateModal.onClose}
        balance={balance}
        setOpResult={setOpResult}
      />

      <EndDelegationModal
        isOpen={EndDelegateModal.isOpen}
        onClose={EndDelegateModal.onClose}
        setOpResult={setOpResult}
        balance={balance}
        bakerAddress={
          !!stakingOpsStatus.Delegated
            ? (accountInfo?.delegate.address as string)
            : ''
        }
      />
    </Flex>
  )
}

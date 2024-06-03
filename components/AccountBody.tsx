import React, { useState, useEffect } from 'react'
import {
  Flex,
  Image,
  Text,
  Grid,
  useDisclosure,
  Link as ChakraLink,
  Box,
  Spinner
} from '@chakra-ui/react'
import Link from 'next/link'
import { DelegateData } from '../app/page'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  StakingOpsStatus,
  AccountInfo,
  UnstakedOperation
} from './Operations/tezInterfaces'
import { useConnection } from '../providers/ConnectionProvider'
import { simplifyAddress } from '@/utils/simpliftAddress'
import { PrimaryButton } from './buttons/PrimaryButton'
import { CloseIcon } from '@chakra-ui/icons'
import {
  useFetchAccountData,
  updateStakingOpsStatus
} from './Operations/tezConnections'
import { SecondaryButton } from './buttons/SecondaryButton'
import { DelegationModal } from '@/components/operationModals/Delegate'
import { EndDelegationModal } from '@/components/operationModals/EndDelegate'
import { StakeModal } from './operationModals/Stake'
import { UnstakeModal } from './operationModals/Unstake'
import { PendingUnstakeSection } from './operationModals/FinalizeUnstake/PendingUnstakeSection'
import { ErrorModal } from './ErrorModal'
import { useOperationError } from '@/providers/OperationErrorProvider'

const getNumOfUnstake = (
  unstOps?: UnstakedOperation[],
  totalFinalizableAmount?: number
) => {
  let result = 0
  unstOps?.forEach(op => {
    if (!!op.remainingFinalizableAmount) result += 1
  })
  if (!!totalFinalizableAmount) result += 1
  return result
}

export const AccountBody = ({
  spendableBalance,
  stakedBalance
}: DelegateData) => {
  const delegateModal = useDisclosure()
  const endDelegateModal = useDisclosure()
  const stakeModal = useDisclosure()
  const unstakeModal = useDisclosure()

  const { address } = useConnection()

  const { operationErrorMessage } = useOperationError()

  const {
    blockchainHeadData,
    accountInfoData,
    unstakedOpsData,
    isLoading,
    error
  } = useFetchAccountData(address)

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

  const numOfPendingUnstake = getNumOfUnstake(
    unstakedOps,
    accountInfo?.totalFinalizableAmount
  )

  if (isLoading) return <Spinner />

  return (
    <>
      {(error || operationErrorMessage) && (
        <ErrorModal message={operationErrorMessage} />
      )}
      <Flex
        flexDir='column'
        alignItems='center'
        justify='space-around'
        p='40px'
        borderTopRadius='16px'
        borderBottomRadius={!!numOfPendingUnstake ? '' : '16px'}
        bg='#FFF'
        w='100%'
        gap={['30px', null, '40px']}
      >
        <Grid
          w='100%'
          templateColumns={['repeat(1, 1fr)', null, 'repeat(2, 1fr)']}
          gap='20px'
        >
          <Flex flexDir='column' borderTop='1px solid #EDF2F7' pt='20px'>
            <Text fontSize='14px' color='#4A5568'>
              AVAILABLE
            </Text>
            {spendableBalance && <Text>{spendableBalance} ꜩ</Text>}
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
              {stakingOpsStatus.Delegated && (
                <Flex
                  justify='center'
                  alignItems='center'
                  gap='5px'
                  _hover={{ cursor: 'pointer' }}
                  onClick={async () => {
                    endDelegateModal.onOpen()
                  }}
                >
                  <Text fontSize='14px'>End </Text>
                  <CloseIcon fontSize='10px' />
                </Flex>
              )}
            </Flex>
            <Flex alignItems='center' gap='5px'>
              {stakingOpsStatus.Delegated ? (
                <Image src='/images/active-icon.svg' alt='active icon' />
              ) : (
                <Image src='/images/inactive-icon.svg' alt='inactive icon' />
              )}
              <Text>{stakingOpsStatus.Delegated ? 'Active ' : 'Inactive'}</Text>
            </Flex>
          </Flex>
          <Flex flexDir='column' borderTop='1px solid #EDF2F7' pt='20px'>
            <Flex justify='space-between' alignItems='center'>
              <Text fontSize='14px' color='#4A5568'>
                BAKER
              </Text>
              {!!stakingOpsStatus.Delegated ? (
                <Flex alignItems='center' gap='4px'>
                  <Text>Change</Text>
                  <Image
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => delegateModal.onOpen()}
                    src='/images/FiEdit.svg'
                    alt='edit icon'
                  />
                </Flex>
              ) : (
                <ChakraLink
                  as={Link}
                  href={`${process.env.NEXT_PUBLIC_TZKT_UI_URL}/bakers`}
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
              )}
            </Flex>
            <Text>
              {!!accountInfo?.delegate?.address
                ? simplifyAddress(accountInfo.delegate.address)
                : '--'}
            </Text>
          </Flex>
        </Grid>

        <Flex w='100%' gap='20px'>
          {!stakingOpsStatus.Delegated && (
            <PrimaryButton onClick={() => delegateModal.onOpen()} w='100%'>
              Delegate
            </PrimaryButton>
          )}
          {!!stakingOpsStatus.Delegated && (
            <SecondaryButton
              disabled={
                !!stakingOpsStatus.Delegated && !stakingOpsStatus.CanUnstake
              }
              onClick={() => unstakeModal.onOpen()}
              w='100%'
            >
              Unstake
            </SecondaryButton>
          )}

          <PrimaryButton
            disabled={
              !stakingOpsStatus.Delegated ||
              !stakingOpsStatus.CanStake ||
              !spendableBalance
            }
            onClick={() => stakeModal.onOpen()}
            w='100%'
          >
            Stake
          </PrimaryButton>
        </Flex>

        {/* below are all operation modals. TODO: how to make this more nit, rather than put all modals here, maybe a function/hook? */}
        <DelegationModal
          isOpen={delegateModal.isOpen}
          onClose={delegateModal.onClose}
          spendableBalance={spendableBalance}
        />

        <EndDelegationModal
          isOpen={endDelegateModal.isOpen}
          onClose={endDelegateModal.onClose}
          spendableBalance={spendableBalance}
          bakerAddress={
            !!stakingOpsStatus.Delegated && !!accountInfo?.delegate?.address
              ? accountInfo?.delegate.address
              : ''
          }
        />

        <StakeModal
          isOpen={stakeModal.isOpen}
          onClose={stakeModal.onClose}
          spendableBalance={spendableBalance}
        />

        <UnstakeModal
          isOpen={unstakeModal.isOpen}
          onClose={unstakeModal.onClose}
          stakedAmount={stakedBalance}
        />
      </Flex>

      {!!numOfPendingUnstake && (
        <Box p='40px' borderBottomRadius='16px' bg='#FFF' w='100%'>
          <PendingUnstakeSection
            totalFinalizableAmount={accountInfo?.totalFinalizableAmount}
            unstOps={unstakedOps}
            numOfPendingUnstake={numOfPendingUnstake}
          />
        </Box>
      )}
    </>
  )
}

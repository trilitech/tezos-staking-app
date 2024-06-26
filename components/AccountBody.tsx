import React, { useState, useEffect } from 'react'
import {
  Flex,
  Image,
  Text,
  Grid,
  useDisclosure,
  Box,
  Spinner
} from '@chakra-ui/react'
import { DelegateData } from '@/pages'
import {
  StakingOpsStatus,
  AccountInfo,
  UnstakedOperation
} from './Operations/tezInterfaces'
import { useConnection } from '../providers/ConnectionProvider'
import { simplifyAddress } from '@/utils/simpliftAddress'
import { PrimaryButton } from './buttons/PrimaryButton'
import {
  useFetchAccountData,
  updateStakingOpsStatus
} from './Operations/tezConnections'
import { SecondaryButton } from './buttons/SecondaryButton'
import { DelegationModal } from '@/components/operationModals/Delegate'
import { EndDelegationModal } from '@/components/operationModals/EndDelegate'
import { StakeModal } from './operationModals/Stake'
import { UnstakeModal } from './operationModals/Unstake'
import { ChangeBakerModal } from './operationModals/ChangeBaker'
import { PendingUnstakeSection } from './operationModals/FinalizeUnstake/PendingUnstakeSection'
import { ErrorModal } from './ErrorModal'
import { SuccessModal } from './SuccessModal'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import useClipboard from '@/utils/useClipboard'
import { Change, End, ViewBakers } from './ctas'
import { CopyAlert } from './CopyAlert'

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
  const changeBakerModal = useDisclosure()
  const endDelegateModal = useDisclosure()
  const stakeModal = useDisclosure()
  const unstakeModal = useDisclosure()

  const { isCopied, copyTextToClipboard } = useClipboard()
  const { address } = useConnection()
  const {
    success: operationSuccess,
    title,
    message,
    opHash,
    resetOperation
  } = useOperationResponse()

  const {
    blockchainHeadData,
    accountInfoData,
    unstakedOpsData,
    isLoading,
    error: fetchAccountError
  } = useFetchAccountData(address)

  const [stakingOpsStatus, setStakingOpsStatus] = useState<StakingOpsStatus>({
    Delegated: false,
    CanStake: false,
    CanUnstake: false,
    CanFinalizeUnstake: false
  })
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [isFirstTime, setIsFirstTime] = useState(false)
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
      setIsFirstTime(accountInfo?.type === 'empty')
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
      {isCopied && <CopyAlert />}

      {fetchAccountError && (
        <ErrorModal
          onClick={() => window.location.reload()}
          btnText='Refresh'
          message={message}
        />
      )}
      {operationSuccess && (
        <SuccessModal
          open={operationSuccess}
          title={title}
          desc={message}
          tzktLink={`${process.env.NEXT_PUBLIC_TZKT_UI_URL}/${opHash}`}
          resetOperation={resetOperation}
        />
      )}
      <Flex
        flexDir='column'
        alignItems='center'
        justify='space-around'
        p={['24px', null, '40px']}
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
          <Flex
            flexDir='column'
            borderTop={[null, null, '1px solid #EDF2F7']}
            pt={[null, null, '20px']}
          >
            <Text fontSize='14px' color='#4A5568' fontWeight={600}>
              AVAILABLE
            </Text>
            <Text fontWeight={600} fontSize='18px' color='#171923'>
              {!!spendableBalance ? spendableBalance : 0}{' '}
              <Text as='span' fontWeight={400}>
                ꜩ
              </Text>
            </Text>
          </Flex>
          <Flex flexDir='column' borderTop='1px solid #EDF2F7' pt='20px'>
            <Text fontSize='14px' color='#4A5568' fontWeight={600}>
              STAKED
            </Text>
            <Flex gap='6px' alignItems='center'>
              {!!stakedBalance && (
                <Image
                  w='18px'
                  h='18px'
                  src='/images/lock.svg'
                  alt='lock icon'
                />
              )}
              <Text fontWeight={600} fontSize='18px' color='#171923'>
                {!!stakedBalance ? stakedBalance : 0}{' '}
                <Text as='span' fontWeight={400}>
                  ꜩ
                </Text>
              </Text>
            </Flex>
          </Flex>
          <Flex flexDir='column' borderTop='1px solid #EDF2F7' pt='20px'>
            <Flex justify='space-between' alignItems='center'>
              <Text fontSize='14px' color='#4A5568' fontWeight={600}>
                DELEGATION
              </Text>
              {stakingOpsStatus.Delegated && (
                <End
                  onClick={() => {
                    endDelegateModal.onOpen()
                  }}
                />
              )}
            </Flex>
            <Flex alignItems='center' gap='6px'>
              {stakingOpsStatus.Delegated ? (
                <Image src='/images/active-icon.svg' alt='active icon' />
              ) : (
                <Image src='/images/inactive-icon.svg' alt='inactive icon' />
              )}
              <Text fontWeight={600} fontSize='18px' color='#171923'>
                {stakingOpsStatus.Delegated ? 'Active ' : 'Inactive'}
              </Text>
            </Flex>
          </Flex>
          <Flex flexDir='column' borderTop='1px solid #EDF2F7' pt='20px'>
            <Flex justify='space-between' alignItems='center'>
              <Text fontSize='14px' color='#4A5568' fontWeight={600}>
                BAKER
              </Text>
              {!!stakingOpsStatus.Delegated ? (
                <Change onClick={() => changeBakerModal.onOpen()} />
              ) : (
                <ViewBakers />
              )}
            </Flex>

            {stakingOpsStatus.Delegated ? (
              <Flex gap='6px' alignItems='center'>
                <Text
                  color='#171923'
                  fontSize='18px'
                  fontWeight={600}
                  lineHeight='18px'
                >
                  {accountInfo?.delegate.alias ??
                    simplifyAddress(accountInfo?.delegate.address ?? '')}
                </Text>
                <Image
                  h='18px'
                  w='18px'
                  color='#A0AEC0'
                  _hover={{ cursor: 'pointer' }}
                  src='/images/copy-icon.svg'
                  alt='copy icon'
                  onClick={() =>
                    copyTextToClipboard(accountInfo?.delegate.address ?? '')
                  }
                />
              </Flex>
            ) : (
              <Text
                color='#A0AEC0'
                fontSize='18px'
                fontWeight={600}
                lineHeight='18px'
              >
                --
              </Text>
            )}
          </Flex>
        </Grid>

        <Flex w='100%' gap={['16px', null, '20px', '30px']}>
          {!stakingOpsStatus.Delegated && (
            <PrimaryButton
              disabled={isFirstTime}
              onClick={() => delegateModal.onOpen()}
              w='100%'
            >
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
        />

        <ChangeBakerModal
          isOpen={changeBakerModal.isOpen}
          onClose={changeBakerModal.onClose}
        />

        <EndDelegationModal
          isOpen={endDelegateModal.isOpen}
          onClose={endDelegateModal.onClose}
          spendableBalance={spendableBalance}
          bakerName={
            (accountInfo?.delegate?.alias || accountInfo?.delegate?.address) ??
            ''
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
        <Box
          p={['24px', null, '40px']}
          borderBottomRadius='16px'
          bg='#FFF'
          w='100%'
        >
          <PendingUnstakeSection
            totalFinalizableAmount={accountInfo?.totalFinalizableAmount}
            unstOps={unstakedOps}
            numOfPendingUnstake={numOfPendingUnstake}
            spendableBalance={spendableBalance}
          />
        </Box>
      )}
    </>
  )
}

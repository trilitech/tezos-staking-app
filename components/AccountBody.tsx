import React, { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Grid,
  Image,
  Spinner,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { DelegateData } from '@/pages'
import {
  AccountInfo,
  BakerInfo,
  StakingOpsStatus,
  UnstakedOperation
} from './Operations/tezInterfaces'
import { useConnection } from '@/providers/ConnectionProvider'
import { simplifyAddress } from '@/utils/simpliftAddress'
import { PrimaryButton } from './buttons/PrimaryButton'
import {
  updateStakingOpsStatus,
  useFetchAccountData
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
import { ExpandBakerInfoTable } from './ExpandBakerInfoTable'
import _ from 'lodash'
import { DisabledStakeAlert } from '@/components/DisabledStakeAlert'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'
import { SelectOptionModal } from './operationModals/SelectOption'
import { EndIcon } from './ctas/End'

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
  delegateData,
  bakerList
}: {
  bakerList: BakerInfo[]
  delegateData: DelegateData
}) => {
  let { spendableBalance, stakedBalance } = delegateData ?? {
    spendableBalance: 0,
    stakedBalance: 0
  }
  const selectOptionModal = useDisclosure()

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
    amount,
    opHash,
    resetOperation,
    opType
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
    CanFinalizeUnstake: false,
    bakerAcceptsStaking: false,
    pendingUnstakeOpsWithAnotherBaker: false,
    loadingDone: false
  })
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [isFirstTime, setIsFirstTime] = useState<boolean | undefined>(undefined)
  const [unstakedOps, setUnstakedOps] = useState<UnstakedOperation[]>(
    [] as UnstakedOperation[]
  )

  const [successClose, setSuccessClose] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>('')

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (successClose) {
      timeout = setTimeout(() => {
        setSuccessClose(false)
      }, 10000)
    }
    return () => clearTimeout(timeout)
  }, [successClose])

  useEffect(() => {
    if (accountInfoData && blockchainHeadData) {
      const { opStatus, unstakingOps, totalFinalizableAmount } =
        updateStakingOpsStatus(
          blockchainHeadData,
          accountInfoData,
          unstakedOpsData,
          stakingOpsStatus,
          bakerList
        )
      accountInfoData.totalFinalizableAmount = totalFinalizableAmount
      if (accountInfoData.type === 'delegate') {
        accountInfoData.evaluatedDelegate = {
          address: accountInfoData.address,
          alias: accountInfoData.alias,
          active: true
        }
      } else if (accountInfoData.type === 'user') {
        accountInfoData.evaluatedDelegate = accountInfoData.delegate
      }
      setAccountInfo(accountInfoData)
      if (accountInfo) {
        setIsFirstTime(accountInfo?.type === 'empty')
      }
      setUnstakedOps(unstakingOps)
      setStakingOpsStatus(opStatus)
    }
  }, [
    blockchainHeadData,
    accountInfoData,
    accountInfo,
    unstakedOpsData,
    stakingOpsStatus,
    bakerList
  ])

  const numOfPendingUnstake = getNumOfUnstake(
    unstakedOps,
    accountInfo?.totalFinalizableAmount
  )
  if (isLoading || !Boolean(bakerList) || !stakingOpsStatus.loadingDone || isFirstTime === undefined)
    return (
      <Flex py='120px' w='100%' justifyContent='center'>
        <Spinner />
      </Flex>
    )

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
          amount={amount}
          tzktLink={`${process.env.NEXT_PUBLIC_TZKT_UI_URL}/${opHash}`}
          resetOperation={resetOperation}
          onSuccessClose={() => setSuccessClose(true)}
          setSuccessMessage={setSuccessMessage}
          opType={opType}
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
      >
        <Flex
          w='100%'
          mb={
            (stakingOpsStatus.Delegated && !stakingOpsStatus.CanStake) ||
              (successClose && successMessage)
              ? '24px'
              : 0
          }
          gap='16px'
          flexDir='column'
        >
          <DisabledStakeAlert
            opStatus={stakingOpsStatus}
            acctInfo={accountInfo}
          />
          {successClose && successMessage && (
            <Flex
              w='100%'
              gap='3'
              p='4'
              alignItems='center'
              bg='green.100'
              borderLeft='4px solid'
              borderColor='green.500'
            >
              <Image
                w='24px'
                h='24px'
                src='/images/success-icon.svg'
                alt='success icon'
              />
              <Text
                flex={1}
                dangerouslySetInnerHTML={{ __html: successMessage }}
              />
              <EndIcon
                onClick={() => setSuccessClose(false)}
                cursor='pointer'
                color='green.500'
              />
            </Flex>
          )}
        </Flex>

        <Grid
          mb={['30px', null, '24px']}
          w='100%'
          templateColumns={['repeat(1, 1fr)', null, 'repeat(2, 1fr)']}
          gap='20px'
          columnGap='30px'
        >
          <Flex
            flexDir='column'
            borderTop={[null, null, '1px solid #EDF2F7']}
            pt={[0, null, '20px']}
          >
            <Text fontSize='14px' color='#4A5568' fontWeight={600}>
              SPENDABLE
            </Text>
            <Text display='inline-flex' gap={1} alignItems='center' fontWeight={600} fontSize='18px' color='#171923'>
              {!!spendableBalance ? spendableBalance : 0}{' '}
              <Image mt='4px' h='18px' src='/images/T3.svg' alt='Tezos Logo' />
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
              <Text display='inline-flex' gap={1} alignItems='center' fontWeight={600} fontSize='18px' color='#171923'>
                {!!stakedBalance ? stakedBalance : 0}{' '}
                <Image mt='4px' h='18px' src='/images/T3.svg' alt='Tezos Logo' />
              </Text>
            </Flex>
          </Flex>
          <Flex gap='4px' flexDir='column' borderTop='1px solid #EDF2F7' pt='20px'>
            <Flex justify='space-between' alignItems='center'>
              <Text fontSize='14px' color='#4A5568' fontWeight={600}>
                DELEGATION
              </Text>
            </Flex>
            <Flex justifyContent='space-between' alignItems='center'>
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

              {accountInfo?.type === 'user' && stakingOpsStatus.Delegated && (
                <End
                  onClick={() => {
                    trackGAEvent(
                      GAAction.BUTTON_CLICK,
                      GACategory.END_DELEGATE_BEGIN
                    )
                    endDelegateModal.onOpen()
                  }}
                />
              )}
            </Flex>
          </Flex>
          <Flex flexDir='column' gap='4px' borderTop='1px solid #EDF2F7' pt='20px'>
            <Flex justify='space-between' alignItems='center'>
              <Text fontSize='14px' color='#4A5568' fontWeight={600}>
                BAKER
              </Text>
            </Flex>

            {stakingOpsStatus.Delegated ? (
              <Flex
                gap='16px'
                justifyContent='space-between'
                alignItems='center'
              >
                <Flex alignItems='center' gap='6px'>
                  {' '}
                  <Text
                    color='#171923'
                    fontSize='18px'
                    fontWeight={600}
                    lineHeight='18px'
                    noOfLines={1}
                  >
                    {accountInfo?.evaluatedDelegate?.alias ?? simplifyAddress(accountInfo?.evaluatedDelegate?.address ?? '')}
                  </Text>
                  <Image
                    h='18px'
                    w='18px'
                    color='#A0AEC0'
                    _hover={{ cursor: 'pointer' }}
                    src='/images/copy-icon.svg'
                    alt='copy icon'
                    onClick={() =>
                      copyTextToClipboard(
                        accountInfo?.evaluatedDelegate.address ?? ''
                      )
                    }
                  />
                </Flex>
                {accountInfo?.type === 'user' &&
                  (stakingOpsStatus.Delegated ? (
                    <Change
                      onClick={() => {
                        trackGAEvent(
                          GAAction.BUTTON_CLICK,
                          GACategory.CHOOSE_CHANGE_BAKER
                        )
                        changeBakerModal.onOpen()
                      }}
                    />
                  ) : (
                    <ViewBakers />
                  ))}
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
        <Flex direction='column' w='100%' gap={['30px', null, '40px']}>
          {(accountInfo?.type ?? 'user') === 'user' &&
            stakingOpsStatus.Delegated &&
            stakingOpsStatus.bakerAcceptsStaking && (
              <ExpandBakerInfoTable
                baker={_.find(bakerList, {
                  address: accountInfo?.delegate?.address
                })}
              />
            )}

          <Flex direction='row' w='100%' gap={['16px', null, '20px', '30px']}>
            {!stakingOpsStatus.Delegated && (
              <PrimaryButton
                maxW={''}
                disabled={isFirstTime}
                onClick={() => {
                  selectOptionModal.onOpen()
                }}
                w='100%'
              >
                Start Earning
              </PrimaryButton>
            )}
            {stakingOpsStatus.Delegated && (
              <SecondaryButton
                disabled={
                  stakingOpsStatus.Delegated && !stakingOpsStatus.CanUnstake
                }
                onClick={() => {
                  trackGAEvent(GAAction.BUTTON_CLICK, GACategory.CHOOSE_UNSTAKE)
                  unstakeModal.onOpen()
                }}
                w='100%'
              >
                Unstake
              </SecondaryButton>
            )}

            {stakingOpsStatus.Delegated && (
              <PrimaryButton
                disabled={!stakingOpsStatus.CanStake}
                onClick={() => {
                  trackGAEvent(GAAction.BUTTON_CLICK, GACategory.CHOOSE_STAKE)
                  stakeModal.onOpen()
                }}
                w='100%'
              >
                Stake
              </PrimaryButton>
            )}
          </Flex>
        </Flex>
        {/* below are all operation modals. TODO: how to make this more nit, rather than put all modals here, maybe a function/hook? */}
        <SelectOptionModal
          isOpen={selectOptionModal.isOpen}
          onClose={selectOptionModal.onClose}
          bakerList={bakerList}
          spendableBalance={spendableBalance}
          stakingOpsStatus={stakingOpsStatus}
        />
        <DelegationModal
          isOpen={delegateModal.isOpen}
          onClose={delegateModal.onClose}
          bakerList={bakerList}
          currentBakerAddress={accountInfo?.evaluatedDelegate?.address}
        />
        <ChangeBakerModal
          isStaked={!!accountInfo?.stakedBalance}
          isOpen={changeBakerModal.isOpen}
          onClose={changeBakerModal.onClose}
          bakerList={bakerList}
          currentBakerAddress={accountInfo?.evaluatedDelegate?.address}
        />
        <EndDelegationModal
          isStaked={!!accountInfo?.stakedBalance}
          isOpen={endDelegateModal.isOpen}
          onClose={endDelegateModal.onClose}
          spendableBalance={spendableBalance}
          bakerName={
            (accountInfo?.evaluatedDelegate?.alias ||
              accountInfo?.evaluatedDelegate?.address) ??
            ''
          }
        />
        <StakeModal
          openedFromStartEarning={false}
          bakerList={bakerList}
          isOpen={stakeModal.isOpen}
          onClose={stakeModal.onClose}
          spendableBalance={spendableBalance}
          currentBakerAddress={accountInfo?.evaluatedDelegate?.address}
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

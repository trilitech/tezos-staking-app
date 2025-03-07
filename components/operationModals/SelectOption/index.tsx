import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex,
  Text,
  Button,
  Image,
  Box,
  Heading,
  useDisclosure
} from '@chakra-ui/react'
import { BakerInfo, StakingOpsStatus } from '@/components/Operations/tezInterfaces'
import { CloseIcon } from '@/components/icons'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { DelegationModal } from '../Delegate'
import { StakeModal } from '../Stake'

export interface DelegateModalProps {
  isOpen: boolean
  onClose: () => void
  bakerList: BakerInfo[] | null
  spendableBalance: number
  stakingOpsStatus: StakingOpsStatus
}

export const SelectOptionModal = ({
  isOpen,
  onClose,
  bakerList,
  spendableBalance,
  stakingOpsStatus
}: DelegateModalProps) => {
  const delegateModal = useDisclosure()
  const stakeModal = useDisclosure()

  return (
    <>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        scrollBehavior='inside'
      >
        <ModalOverlay />
        <ModalContent pb='0px' maxW='100%' w={['100%', null, '974px']}>
          <ModalHeader p={['24px', null, '40px']} pb={['12px !important', null, '20px']}>
            <Flex h='36px' position='relative' alignItems='center' w='100%'>
              <Button
                position='absolute'
                left='0'
                border='solid 1px #EDF2F7'
                px='12px'
                py='24px'
                borderRadius='8px'
                bg='transparent'
                as='a'
                href='/faqs'
                target='_blank'
                gap='2'
                _hover={{
                  bg: '#f8fafc'
                }}
              >
                <Image
                  w='24px'
                  h='24px'
                  src='/images/help-icon-dapp.svg'
                  alt='logout'
                />
                <Text fontSize='sm'>Help</Text>
              </Button>

              <Text
                display={['none', null, 'block']}
                position='absolute'
                left='50%'
                transform='translateX(-50%)'
              >
                Select Your Option
              </Text>

              <CloseIcon
                position='absolute'
                right='0'
                cursor='pointer'
                onClick={() => {
                  trackGAEvent(
                    GAAction.BUTTON_CLICK,
                    GACategory.CHOOSE_BAKER_CLOSED
                  )
                  onClose()
                }}
              />
            </Flex>
            <Text
              display={['block', null, 'none']}
              pt='24px'
              textAlign='center'
            >
              Select Your Option
            </Text>
          </ModalHeader>

          <ModalBody px={['24px', null, '40px']} pb='0px'>
            <Flex
              w='100%'
              flexDir={['column', null, 'row']}
              flexWrap='wrap'
              borderRadius='4px'
              pb={['12px', null, '40px']}
              pt={['12px', null, '20px']}
              gap='24px'
            >
              <Flex
                bg='white'
                boxShadow='0px 2px 12px 0px rgba(20, 20, 43, 0.08)'
                textAlign={'center'}
                flexDir='column'
                position='relative'
                zIndex={1}
                flex={1}
                borderRadius='16px'
                p={['24px', null, '40px']}
              >
                <Heading
                  as='h1'
                  fontSize={['lg', null, 'xl']}
                  color='gray.900'
                  textAlign='left'
                  fontWeight={600}
                  pb={['4px', null, '16px']}
                >
                  Delegate
                </Heading>
                <Text
                  textAlign='left'
                  as='h2'
                  fontSize={['sm', null, 'lg']}
                  color={'gray.600'}
                  pb={['0px', null, '24px']}
                >
                  Earn risk-free rewards by delegating
                </Text>
                <Flex
                  display={['none', null, 'flex']}
                  py='18px'
                  borderTop='1px solid #EDF2F7'
                  gap={2}
                >
                  <Image
                    maxW='24px'
                    src='/images/copy-alt-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text fontSize='sm'>Your full balance will be delegated</Text>
                </Flex>
                <Flex
                  display={['none', null, 'flex']}
                  py='18px'
                  borderTop='1px solid #EDF2F7'
                  gap={2}
                >
                  <Image
                    maxW='24px'
                    src='/images/like-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text fontSize='sm'>
                    Delegated funds remain in your account
                  </Text>
                </Flex>
                <Flex
                  display={['none', null, 'flex']}
                  py='18px'
                  mb='30px'
                  borderY='1px solid #EDF2F7'
                  gap={2}
                >
                  <Image
                    maxW='24px'
                    src='/images/cool-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text fontSize='sm'>Spend your tez at any time</Text>
                </Flex>
                <Flex
                  flexDir={['column', null, 'row']}
                  py='18px'
                  pt={['26px', null, '18px']}
                  mb='8px'
                  gap={['12px', null, '24px']}
                >
                  <Flex
                    alignItems='center'
                    justifyContent='space-between'
                    gap={2}
                  >
                    <Flex justifyContent='center' alignItems='center' gap='6px'>
                      <Image
                        color='red'
                        maxW='110px'
                        src='/images/error-icon-gray.svg'
                        alt='Wallet Icon'
                      />
                      <Text
                        pr='4px'
                        color='gray.600'
                        fontSize='sm'
                      >
                        Risk
                      </Text>
                    </Flex>

                    <Flex gap='4px'>
                      <Box
                        w='24px'
                        h='6px'
                        bg='gray.200'
                        borderRadius='100px'
                      />
                      <Box
                        w='24px'
                        h='6px'
                        bg='gray.200'
                        borderRadius='100px'
                      />
                      <Box
                        w='24px'
                        h='6px'
                        bg='gray.200'
                        borderRadius='100px'
                      />
                    </Flex>
                  </Flex>
                  <Flex
                    alignItems='center'
                    justifyContent='space-between'
                    gap={2}
                  >
                    <Flex justifyContent='center' alignItems='center' gap='6px'>
                      <Image
                        maxW='24px'
                        src='/images/trophy-icon.svg'
                        alt='Wallet Icon'
                      />
                      <Text
                        pr='4px'
                        color='gray.600'
                        fontSize='sm'
                      >
                        Reward
                      </Text>
                    </Flex>
                    <Flex gap='4px'>
                      <Box w='24px' h='6px' bg='#38A169' borderRadius='100px' />
                      <Box
                        w='24px'
                        h='6px'
                        bg='gray.200'
                        borderRadius='100px'
                      />
                      <Box
                        w='24px'
                        h='6px'
                        bg='gray.200'
                        borderRadius='100px'
                      />
                    </Flex>
                  </Flex>
                </Flex>
                <Flex
                  w='full'
                  direction={['column', 'row']}
                  gap={[2, 3]}
                  align={'center'}
                  alignSelf={['center', 'start']}
                  position={'relative'}
                >
                  <PrimaryButton
                    onClick={() => {
                      onClose()
                      trackGAEvent(
                        GAAction.BUTTON_CLICK,
                        GACategory.CHOOSE_BAKER_START
                      )
                      setTimeout(() => {
                        delegateModal.onOpen()
                      }, 1)
                    }}
                    variant='secondary'
                    w='full'
                  >
                    Delegate
                  </PrimaryButton>
                </Flex>
              </Flex>
              <Flex
                bg='white'
                boxShadow='0px 2px 12px 0px rgba(20, 20, 43, 0.08)'
                textAlign={'center'}
                flexDir='column'
                flex={1}
                borderRadius='16px'
                p={['24px', null, '40px']}
              >
                <Heading
                  as='h1'
                  fontSize={['lg', null, 'xl']}
                  color='gray.900'
                  textAlign='left'
                  fontWeight={600}
                  pb={['4px', null, '16px']}
                >
                  Stake
                </Heading>
                <Text
                  textAlign='left'
                  as='h2'
                  fontSize={['sm', null, 'lg']}
                  color={'gray.600'}
                  pb={['0px', null, '24px']}
                >
                  Earn higher rewards by staking
                </Text>
                <Flex
                  display={['none', null, 'flex']}
                  py='18px'
                  borderTop='1px solid #EDF2F7'
                  gap={2}
                >
                  <Image
                    maxW='24px'
                    src='/images/pie-chart-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text fontSize='sm'>Stake however much tez you'd like</Text>
                </Flex>
                <Flex
                  display={['none', null, 'flex']}
                  py='18px'
                  borderTop='1px solid #EDF2F7'
                  gap={2}
                >
                  <Image
                    maxW='24px'
                    src='/images/lock-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text fontSize='sm'>
                    Staked funds are locked in your account
                  </Text>
                </Flex>
                <Flex
                  display={['none', null, 'flex']}
                  py='18px'
                  mb='30px'
                  borderY='1px solid #EDF2F7'
                  gap={2}
                >
                  <Image
                    maxW='24px'
                    src='/images/analyse-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text fontSize='sm'>Approximately 10 days for unstaking</Text>
                </Flex>
                <Flex
                  flexDir={['column', null, 'row']}
                  py='18px'
                  pt={['26px', null, '18px']}
                  mb='8px'
                  gap={['12px', null, '24px']}
                >
                  <Flex
                    alignItems='center'
                    justifyContent='space-between'
                    gap={2}
                  >
                    <Flex justifyContent='center' alignItems='center' gap='6px'>
                      <Image
                        maxW='110px'
                        src='/images/error-icon-gray.svg'
                        alt='Wallet Icon'
                      />
                      <Text
                        pr='4px'
                        color='gray.600'
                        fontSize='sm'
                      >
                        Risk
                      </Text>
                    </Flex>
                    <Flex gap='4px'>
                      <Box w='24px' h='6px' bg='#E53E3E' borderRadius='100px' />
                      <Box
                        w='24px'
                        h='6px'
                        bg='gray.200'
                        borderRadius='100px'
                      />
                      <Box
                        w='24px'
                        h='6px'
                        bg='gray.200'
                        borderRadius='100px'
                      />
                    </Flex>
                  </Flex>
                  <Flex
                    alignItems='center'
                    justifyContent='space-between'
                    gap={2}
                  >
                    <Flex justifyContent='center' alignItems='center' gap='6px'>
                      <Image
                        maxW='24px'
                        src='/images/trophy-icon.svg'
                        alt='Wallet Icon'
                      />
                      <Text
                        pr='4px'
                        color='gray.600'
                        fontSize='sm'
                      >
                        Reward
                      </Text>
                    </Flex>
                    <Flex gap='4px'>
                      <Box w='24px' h='6px' bg='#38A169' borderRadius='100px' />
                      <Box w='24px' h='6px' bg='#38A169' borderRadius='100px' />
                      <Box w='24px' h='6px' bg='#38A169' borderRadius='100px' />
                    </Flex>
                  </Flex>
                </Flex>
                <Flex
                  w='full'
                  direction={['column', 'row']}
                  gap={[2, 3]}
                  align={'center'}
                  alignSelf={['center', 'start']}
                  position={'relative'}
                >
                  <PrimaryButton
                    onClick={() => {
                      onClose()
                      trackGAEvent(
                        GAAction.BUTTON_CLICK,
                        GACategory.CHOOSE_BAKER_START
                      )
                      setTimeout(() => {
                        stakeModal.onOpen()
                      }, 1)
                    }}
                    variant='secondary'
                    w='full'
                  >
                    Stake
                  </PrimaryButton>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <DelegationModal
        isOpen={delegateModal.isOpen}
        onClose={delegateModal.onClose}
        bakerList={bakerList}
        currentBakerAddress={undefined}
      />
      <StakeModal
        openedFromStartEarning={true}
        isOpen={stakeModal.isOpen}
        onClose={stakeModal.onClose}
        spendableBalance={spendableBalance}
        bakerList={bakerList}
        currentBakerAddress={undefined}
        stakingOpsStatus={stakingOpsStatus}
      />
    </>
  )
}

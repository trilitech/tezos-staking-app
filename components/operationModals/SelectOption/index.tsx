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
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { DelegateStart } from './DelegateStart'
import { ChooseBaker } from './ChooseBaker'
import useCurrentStep from '@/utils/useCurrentStep'
import { Stepper } from '@/components/modalBody/Stepper'
import { BackIcon, CloseIcon } from '@/components/icons'
import { ConfirmBaker } from './ConfirmBaker'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { DelegationModal } from '../Delegate'
import { StakeModal } from '../Stake'

export interface DelegateModalProps {
  isOpen: boolean
  onClose: () => void
  bakerList: BakerInfo[] | null
  spendableBalance: number
}

enum DelegateStatus {
  DelegationStart = 1,
  ChooseBaker = 2,
  DelegationConfirm = 3
}

const bakersListApiUrl = `${process.env.NEXT_PUBLIC_TZKT_API_URL}/v1/delegates?active=true&limit=1000`
export async function getBakerList() {
  const response = await fetch(bakersListApiUrl)
  if (!response.ok) {
    console.error('Failed to fetch baker list')
    return null
  }
  return response.json()
}

export const SelectOptionModal = ({
  isOpen,
  onClose,
  bakerList,
  spendableBalance
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
        <ModalContent minW='90%'>
          <ModalHeader p='40px'>
            <Flex h='36px' position='relative' alignItems='center' w='100%'>
              {/* Left Button */}
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

              {/* Center Text */}
              <Text position='absolute' left='50%' transform='translateX(-50%)'>
                Select Your Option
              </Text>

              {/* Right Icon */}
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
          </ModalHeader>

          <ModalBody>
            <Flex
              w='100%'
              flexDir={['column', null, null, 'row']}
              flexWrap='wrap'
              borderRadius='4px'
              py='48px'
              gap={['43px', null, null, '80px']}
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
                py={['24px', null, '40px']}
                px={['24px', null, null, null, '48px']}
              >
                <Heading
                  as='h1'
                  fontSize='2xl'
                  color='gray.900'
                  textAlign='left'
                  fontWeight={600}
                  pb='16px'
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
                    maxW='110px'
                    src='/images/copy-alt-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text fontSize='lg'>Your full balance will be delegated</Text>
                </Flex>
                <Flex
                  display={['none', null, 'flex']}
                  py='18px'
                  borderTop='1px solid #EDF2F7'
                  gap={2}
                >
                  <Image
                    maxW='110px'
                    src='/images/like-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text fontSize='lg'>
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
                    maxW='110px'
                    src='/images/cool-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text fontSize='lg'>Spend your tez at any time</Text>
                </Flex>
                <Flex
                  flexDir={['column', null, 'row']}
                  py='18px'
                  mb='30px'
                  gap='30px'
                >
                  <Flex
                    alignItems='center'
                    justifyContent='space-between'
                    gap={2}
                  >
                    <Flex justifyContent='center' alignItems='center' gap='6px'>
                      <Image
                        maxW='110px'
                        src='/images/error-icon.svg'
                        alt='Wallet Icon'
                      />
                      <Text
                        pr='8px'
                        color='gray.600'
                        fontSize={['sm', null, 'md']}
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
                        maxW='110px'
                        src='/images/trophy-icon.svg'
                        alt='Wallet Icon'
                      />
                      <Text
                        pr='8px'
                        color='gray.600'
                        fontSize={['sm', null, 'md']}
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
                        console.log('si apre')
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
                py={['24px', null, '40px']}
                px={['24px', null, null, null, '48px']}
              >
                <Heading
                  as='h1'
                  fontSize='2xl'
                  color='gray.900'
                  textAlign='left'
                  fontWeight={600}
                  pb='16px'
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
                    maxW='110px'
                    src='/images/pie-chart-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text fontSize='lg'>Your full balance will be delegated</Text>
                </Flex>
                <Flex
                  display={['none', null, 'flex']}
                  py='18px'
                  borderTop='1px solid #EDF2F7'
                  gap={2}
                >
                  <Image
                    maxW='110px'
                    src='/images/lock-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text fontSize='lg'>
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
                    maxW='110px'
                    src='/images/analyse-icon.svg'
                    alt='Wallet Icon'
                  />
                  <Text fontSize='lg'>Spend your tez at any time</Text>
                </Flex>
                <Flex
                  flexDir={['column', null, 'row']}
                  py='18px'
                  mb='30px'
                  gap='30px'
                >
                  <Flex
                    alignItems='center'
                    justifyContent='space-between'
                    gap={2}
                  >
                    <Flex justifyContent='center' alignItems='center' gap='6px'>
                      <Image
                        maxW='110px'
                        src='/images/error-icon.svg'
                        alt='Wallet Icon'
                      />
                      <Text
                        pr='8px'
                        color='gray.600'
                        fontSize={['sm', null, 'md']}
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
                        maxW='110px'
                        src='/images/trophy-icon.svg'
                        alt='Wallet Icon'
                      />
                      <Text
                        pr='8px'
                        color='gray.600'
                        fontSize={['sm', null, 'md']}
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
                        console.log('si apre')
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
      />
      <StakeModal
        isOpen={stakeModal.isOpen}
        onClose={stakeModal.onClose}
        spendableBalance={spendableBalance}
        bakerList={bakerList}
      />
    </>
  )
}

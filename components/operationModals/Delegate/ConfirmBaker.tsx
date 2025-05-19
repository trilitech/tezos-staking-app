import React, { useState } from 'react'
import {
  Flex,
  InputGroup,
  Input,
  Box,
  Image,
  Spinner,
  Text,
  Icon
} from '@chakra-ui/react'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { Header, ColumnHeader } from '@/components/modalBody'
import { BakerDetailsTable } from '@/components/modalBody/BakerDetailsTable'
import { X as CloseIcon } from 'lucide-react'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { useConnection } from '@/providers/ConnectionProvider'
import { setDelegate } from '@/components/Operations/operations'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { ErrorBlock } from '@/components/ErrorBlock'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

interface ChooseBakerProps {
  handleOneStepForward: () => void
  handleOneStepBack: () => void
  handleNStepForward?: (n: number) => void
  selectedBaker: BakerInfo
  openedFromStartEarning: boolean
  setSelectedBaker: (b: null) => void
  isChangeBaker?: boolean
  isStaked?: boolean
  canStake?: boolean
}

export const ConfirmBaker = ({
  handleOneStepForward,
  handleOneStepBack,
  handleNStepForward,
  selectedBaker,
  openedFromStartEarning,
  setSelectedBaker,
  isChangeBaker,
  isStaked,
  canStake
}: ChooseBakerProps) => {
  const { Tezos, beaconWallet } = useConnection()
  const { setMessage, setSuccess, setTitle, setOpHash, setOpType } =
    useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)

  return (
    <Flex flexDir='column' justify='center'>
      <Header pb='24px'>
        {isChangeBaker ? 'Confirm Baker' : 'Delegate to Baker'}
      </Header>
      <InputGroup
        startElement={
          <Box h='100%'>
            <Image
              ml='12px'
              w='30px'
              h='30px'
              objectFit='cover'
              src={`${process.env.NEXT_PUBLIC_TZKT_AVATARS_URL}/${selectedBaker.address}`}
              alt='baker avatar'
            />
          </Box>
        }
        endElement={
          <Box mr='12px' h='100%' w='75px'>
            <Icon
              as={CloseIcon}
              _hover={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedBaker(null)
                handleOneStepBack()
              }}
              w='14px'
              h='14px'
              transform='translateX(20px)'
            />
          </Box>
        }
        mb='30px'
      >
        <Input
          disabled
          pr='4.5rem'
          pl='48px'
          css={{
            '::placeholder': {
              fontSize: '16px'
            }
          }}
          value={selectedBaker.alias ?? 'Private Baker'}
          h='48px'
          overflowX='auto'
          _disabled={{ opacity: 1, fontWeight: 600, color: 'gray.900' }}
        />
      </InputGroup>

      {selectedBaker.acceptsStaking ? (
        <>
          <ColumnHeader mb='12px'>BAKER&#39;S INFO</ColumnHeader>
          <BakerDetailsTable baker={selectedBaker} />
        </>
      ) : (
        <Flex alignItems='center' gap='8px' mb='30px'>
          <Image src='/images/AlertIcon.svg' alt='alert icon' />
          <Text opacity={0.8} fontSize='14px' fontWeight={400} color='darkRed'>
            {selectedBaker.alias ?? 'Private Baker'} does not accept staking
          </Text>
        </Flex>
      )}

      <PrimaryButton
        disabled={!selectedBaker}
        onClick={async () => {
          trackGAEvent(GAAction.BUTTON_CLICK, GACategory.START_DELEGATE_BEGIN)
          if (!Tezos || !beaconWallet) {
            setErrorMessage('Wallet is not initialized, log out to try again.')
            return
          }
          if (!selectedBaker) {
            setErrorMessage('Please select baker')
            return
          }

          setWaitingOperation(true)
          const response = await setDelegate(
            Tezos,
            selectedBaker.address,
            beaconWallet
          )
          setWaitingOperation(false)
          if (response.success) {
            if (!canStake && handleNStepForward) {
              setOpType('pending_unstake')
              setTitle('Pending Unstake Operation!')
              setMessage(
                `You have successfully delegated your balance to the new baker.<br /><br />Before staking with a new baker, you must wait for your current unstake operations to be finalized. The unstaking process takes ${process.env.NEXT_PUBLIC_UNSTAKE_DAYS} days.`
              )
              setOpHash(response.opHash)
              setSuccess(true)
              handleNStepForward(3)
            } else {
              if (!openedFromStartEarning) {
                if (isChangeBaker) {
                  setOpType('change_baker')
                  setMessage(
                    isStaked
                      ? `You have successfully changed your baker and unstaked with your previous baker. Unstaking takes ${process.env.NEXT_PUBLIC_UNSTAKE_DAYS} days, after which you must finalize the process. Once you do, your tez will be made available in your spendable balance.`
                      : 'You have successfully delegated your balance to the baker. You can now choose to stake your tez with the same baker to earn higher rewards.'
                  )
                  trackGAEvent(
                    GAAction.BUTTON_CLICK,
                    GACategory.CHANGE_BAKER_SUCCESS
                  )
                } else {
                  setOpType('delegate')
                  setMessage(
                    'You have successfully delegated your balance to the baker. You can now choose to stake your tez with the same baker to earn higher rewards.'
                  )
                  trackGAEvent(
                    GAAction.BUTTON_CLICK,
                    GACategory.START_DELEGATE_END
                  )
                }
              }
              setOpHash(response.opHash)
              setSuccess(true)
              handleOneStepForward()
            }
          } else {
            setErrorMessage(response.message)
          }
        }}
      >
        {waitingOperation ? <Spinner /> : 'Continue'}
      </PrimaryButton>

      {!!errorMessage && <ErrorBlock errorMessage={errorMessage} />}
    </Flex>
  )
}

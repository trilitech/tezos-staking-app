import React, { useState } from 'react'
import {
  Flex,
  InputGroup,
  Input,
  InputRightElement,
  InputLeftElement,
  Image,
  Spinner,
  Text,
  Icon
} from '@chakra-ui/react'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { Header, ColumnHeader } from '@/components/modalBody'
import { BakerDetailsTable } from '@/components/modalBody/BakerDetailsTable'
import { CloseIcon } from '@chakra-ui/icons'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { useConnection } from '@/providers/ConnectionProvider'
import { setDelegate } from '@/components/Operations/operations'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { ErrorBlock } from '@/components/ErrorBlock'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

interface ChooseBakerProps {
  handleOneStepForward: () => void
  handleOneStepBack: () => void
  selectedBaker: BakerInfo
  setSelectedBaker: (b: null) => void
  isChangeBaker?: boolean
}

export const ConfirmBaker = ({
  handleOneStepForward,
  handleOneStepBack,
  selectedBaker,
  setSelectedBaker,
  isChangeBaker
}: ChooseBakerProps) => {
  const { Tezos, beaconWallet } = useConnection()
  const { setMessage, setSuccess, setOpHash, setOpType } =
    useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)

  return (
    <Flex flexDir='column' justify='center'>
      <Header pb='24px'>Delegate to Baker Y</Header>
      <InputGroup size='md' mb='30px'>
        <InputLeftElement h='100%'>
          <Image
            ml='6px'
            w='30px'
            h='30px'
            objectFit='cover'
            src={`${process.env.NEXT_PUBLIC_TZKT_AVATARS_URL}/${selectedBaker.address}`}
            alt='baker avatar'
          />
        </InputLeftElement>

        <Input
          isDisabled
          pr='4.5rem'
          sx={{
            '::placeholder': {
              fontSize: '16px'
            }
          }}
          value={selectedBaker.alias ?? 'Private Baker'}
          h='58px'
          overflowX='auto'
          _disabled={{ opacity: 1, fontWeight: 600, color: '#171923' }}
        />

        <InputRightElement mr='12px' h='100%' w='75px'>
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
        </InputRightElement>
      </InputGroup>

      {selectedBaker.acceptsStaking ? (
        <>
          <ColumnHeader mb='12px'>BAKER&#39;S INFO</ColumnHeader>
          <BakerDetailsTable baker={selectedBaker} />
        </>
      ) : (
        <Flex alignItems='center' gap='8px' mb='30px'>
          <Image src='/images/AlertIcon.svg' alt='alert icon' />
          <Text opacity={0.8} fontSize='14px' fontWeight={400} color='#C53030'>
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
            if (isChangeBaker)
              trackGAEvent(
                GAAction.BUTTON_CLICK,
                GACategory.CHANGE_BAKER_SUCCESS
              )
            else
              trackGAEvent(GAAction.BUTTON_CLICK, GACategory.START_DELEGATE_END)

            setOpHash(response.opHash)
            setOpType('delegate')
            setMessage(
              'You have successfully delegated your balance to the baker. You can now choose to stake your tez with the same baker to earn higher rewards.'
            )
            setSuccess(true)
            handleOneStepForward()
          } else {
            setErrorMessage(response.message)
          }
        }}
      >
        {waitingOperation ? <Spinner /> : 'Delegate'}
      </PrimaryButton>

      {!!errorMessage && <ErrorBlock errorMessage={errorMessage} />}
    </Flex>
  )
}

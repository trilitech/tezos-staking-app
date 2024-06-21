import React, { useState } from 'react'
import {
  Button,
  Flex,
  InputGroup,
  Input,
  InputRightElement,
  InputLeftElement,
  Image,
  Icon,
  Spinner
} from '@chakra-ui/react'
import { ViewBakers } from '@/components/ctas'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { BakerListDropDown } from './BakerListDropDown'
import { BakerInfo } from '@/components/Operations/tezInterfaces'
import { CloseIcon } from '@chakra-ui/icons'
import { Header, ColumnHeader } from '@/components/modalBody'
import { BakerDetailsTable } from '@/components/modalBody/BakerDetailsTable'
import { useOperationResponse } from '@/providers/OperationResponseProvider'
import { ErrorBlock } from '@/components/ErrorBlock'
import { useConnection } from '@/providers/ConnectionProvider'
import { setDelegate } from '@/components/Operations/operations'

interface ChooseBakerProps {
  handleOneStepForward: () => void
  selectedBaker: BakerInfo | null
  setSelectedBaker: (b: BakerInfo | null) => void
  bakerList: BakerInfo[]
  setShowStepper: (arg: boolean) => void
}

export const ChooseBaker = ({
  handleOneStepForward,
  selectedBaker,
  setSelectedBaker,
  bakerList,
  setShowStepper
}: ChooseBakerProps) => {
  const { Tezos, beaconWallet } = useConnection()
  const { setMessage, setSuccess, setOpHash } = useOperationResponse()
  const [errorMessage, setErrorMessage] = useState('')
  const [waitingOperation, setWaitingOperation] = useState(false)

  const [value, setValue] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const handleChange = (event: any) => {
    const val = event.target.value
    setValue(val)
    findBaker(val)
  }

  const findBaker = (address: string): void => {
    if (!bakerList) return
    const baker = bakerList.find(baker => baker.address === address)

    if (baker) setSelectedBaker(baker)
    else setSelectedBaker(null)
  }

  if (isDropdownOpen) {
    return (
      <BakerListDropDown
        setSelectedBaker={setSelectedBaker}
        setIsDropdownOpen={setIsDropdownOpen}
        bakerList={bakerList}
        setShowStepper={setShowStepper}
      />
    )
  }

  return (
    <Flex flexDir='column' justify='center'>
      <Header pb='24px'>Delegate</Header>
      <Flex alignItems='center' justify='space-between' mb='12px'>
        <ColumnHeader>SELECT BAKER</ColumnHeader>
        <ViewBakers />
      </Flex>
      <InputGroup size='md' mb='30px'>
        {!!selectedBaker && (
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
        )}

        <Input
          onChange={handleChange}
          pr='4.5rem'
          placeholder='Paste tz address'
          sx={{
            '::placeholder': {
              fontSize: '16px'
            }
          }}
          value={
            selectedBaker
              ? selectedBaker.alias
                ? selectedBaker.alias
                : 'Private Baker'
              : value
          }
          h='58px'
          overflowX='auto'
        />

        <InputRightElement mr='12px' h='100%' w='75px'>
          {selectedBaker ? (
            <Icon
              as={CloseIcon}
              _hover={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedBaker(null)
                setValue('')
              }}
              w='14px'
              h='14px'
              transform='translateX(20px)'
            />
          ) : (
            <Button
              h='34px'
              px='12px'
              py='6px'
              borderRadius='8px'
              fontWeight={600}
              fontSize='16px'
              bg='black'
              color='white'
              _hover={{ bg: 'black' }}
              onClick={() => {
                setIsDropdownOpen(true)
                setShowStepper(false)
              }}
            >
              Select
            </Button>
          )}
        </InputRightElement>
      </InputGroup>
      {selectedBaker && (
        <>
          <ColumnHeader mb='12px'>BAKER&#39;S INFO</ColumnHeader>
          <BakerDetailsTable
            alias={selectedBaker.alias}
            address={selectedBaker.address}
            fee={selectedBaker.stakingFees}
            acceptStaking={selectedBaker.acceptsStaking}
            capacity={selectedBaker.stakingFreeSpace}
          />
        </>
      )}

      <PrimaryButton
        disabled={!selectedBaker}
        onClick={async () => {
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
            setOpHash(response.opHash)
            setMessage(
              'You have successfully delegated your balance to the baker. You can now (optionally) stake funds with the baker, and potentially earn higher rewards.'
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

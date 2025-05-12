import React from 'react'
import {
  Dialog,
  useDisclosure,
  Image,
  Flex,
  Text,
  Link as ChakraLink,
  Button
} from '@chakra-ui/react'
import { PrimaryButton } from './buttons/PrimaryButton'
import Link from 'next/link'
import { ExternalLink as ExternalLinkIcon } from 'lucide-react'
import { OpType } from '@/providers/OperationResponseProvider'
import { trackGAEvent, GAAction, GACategory } from '@/utils/trackGAEvent'

const setGAEvent = (opType?: OpType) => {
  switch (opType) {
    case 'delegate':
      trackGAEvent(GAAction.BUTTON_CLICK, GACategory.CONTINUE_AFTER_DELEGATION)
      return
    case 'stake':
      trackGAEvent(GAAction.BUTTON_CLICK, GACategory.CONTINUE_AFTER_STAKE)
      return
    default:
      return
  }
}

const getSuccessMessage = (opType?: OpType, amount?: number) => {
  switch (opType) {
    case 'delegate':
      return 'You have successfully delegated your balance'
    case 'change_baker':
    case 'pending_unstake':
      return 'You have successfully changed your baker'
    case 'end_delegate':
      return 'You have successfully ended your delegation'
    case 'stake':
      return `You have successfully staked <strong>${amount}</strong> tez`
    case 'unstake':
      return `You have successfully requested to unstake <strong>${amount}</strong> tez`
    default:
      return ''
  }
}

export const SuccessModal = ({
  title,
  desc,
  tzktLink,
  resetOperation,
  onSuccessClose,
  setSuccessMessage,
  open,
  opType,
  amount
}: {
  title?: string
  desc: string
  tzktLink: string
  resetOperation: () => void
  onSuccessClose: () => void
  setSuccessMessage: (message: string) => void
  open: boolean
  opType?: OpType
  amount?: number
}) => {
  const { onClose } = useDisclosure()

  return (
    <Dialog.Root isOpen={open} onClose={onClose} placement='center'>
      <Dialog.Backdrop />
      <Dialog.Content>
        <Button
          css={{
            '& svg': {
              width: '14px',
              height: '14px'
            }
          }}
          onClick={() => {
            resetOperation()
            onClose()
            onSuccessClose()
          }}
        />
        <Dialog.Body px='40px' mt='40px'>
          <Flex
            textAlign='center'
            flexDir='column'
            justify='center'
            alignItems='center'
          >
            <Image
              w='24px'
              h='24px'
              src={
                opType === 'pending_unstake'
                  ? '/images/error-icon.svg'
                  : '/images/check.svg'
              }
              alt={opType === 'pending_unstake' ? 'error icon' : 'check icon'}
              mb='16px'
            />
            <Text fontWeight={600} color='gray.900' fontSize='24px' mb='16px'>
              {!!title ? title : 'Nicely Done!'}
            </Text>
            <Text
              fontWeight={400}
              color='gray.700'
              fontSize='16px'
              maxW='300px'
              mb='30px'
              lineHeight='22px'
              dangerouslySetInnerHTML={{ __html: desc }}
            />
            <PrimaryButton
              onClick={() => {
                setGAEvent(opType)
                resetOperation()
                onClose()
                onSuccessClose()
                setSuccessMessage(getSuccessMessage(opType, amount))
              }}
            >
              Continue
            </PrimaryButton>
            <ChakraLink
              as={Link}
              href={tzktLink}
              target='_blank'
              display='flex'
              alignItems='center'
              gap='5px'
              mt='24px'
              _hover={{
                cursor: 'pointer'
              }}
            >
              <Text color='gray.700' fontSize='14px' fontWeight={600}>
                View in TzKT
              </Text>
              <ExternalLinkIcon color='gray.400' />
            </ChakraLink>
          </Flex>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  )
}

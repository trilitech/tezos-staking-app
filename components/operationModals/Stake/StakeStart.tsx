import React, { useState } from 'react'
import { Flex, Text, Checkbox, Image } from '@chakra-ui/react'
import { Header, Description } from '@/components/modalBody'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'

export const StakeStart = ({
  handleOneStepForward
}: {
  handleOneStepForward: () => void
}) => {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <Flex flexDir='column' alignItems='center'>
      <Image
        w='25px'
        mt='24px'
        mb='15px'
        src='/images/alert-icon.svg'
        alt='alert icon'
      />
      <Header mb='15px'>Disclaimer</Header>
      <Description>
        By staking, you put your balance at risk and may lose all your money.
      </Description>
      <Flex
        gap='24px'
        my='24px'
        bg='#EDF2F7'
        borderRadius='10px'
        py='16px'
        px='12px'
      >
        <Checkbox
          isChecked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          border='#2b6cb0'
        />
        <Text color='#2D3748' fontSize='16px' fontWeight={400}>
          I confirm that I have read and agreed with the{' '}
          <Text as='span' textDecor='underline' _hover={{ cursor: 'pointer' }}>
            Terms of Service.
          </Text>
        </Text>
      </Flex>
      <PrimaryButton disabled={!isChecked} onClick={handleOneStepForward}>
        Continue
      </PrimaryButton>
    </Flex>
  )
}

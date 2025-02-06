import React from 'react'
import { Image, Flex } from '@chakra-ui/react'

export const Stepper = ({
  currentStep,
  totalStep
}: {
  currentStep: number
  totalStep: 2 | 3 | 4 | 5
}) => {
  if (totalStep === 2) {
    return (
      <Flex justify='center' alignItems='center' mb='24px'>
        <Image pr='5px' src='/images/stepper/full-dot.svg' alt='dot' />
        <Image pr='5px' src='/images/stepper/line.svg' alt='dot' />
        {currentStep === 1 ? (
          <Image pr='5px' src='/images/stepper/empty-dot.svg' alt='dot' />
        ) : (
          <Image pr='5px' src='/images/stepper/full-dot.svg' alt='dot' />
        )}
      </Flex>
    )
  }

  return (
    <Flex justify='center' alignItems='center' mb='24px'>
      <Image pr='5px' src='/images/stepper/full-dot.svg' alt='dot' />
      <Image pr='5px' src='/images/stepper/line.svg' alt='dot' />
      {currentStep === 1 ? (
        <Image pr='5px' src='/images/stepper/empty-dot.svg' alt='dot' />
      ) : (
        <Image pr='5px' src='/images/stepper/full-dot.svg' alt='dot' />
      )}
      <Image pr='5px' src='/images/stepper/line.svg' alt='dot' />
      {currentStep >= 3 ? (
        <Image src='/images/stepper/full-dot.svg' alt='dot' />
      ) : (
        <Image src='/images/stepper/empty-dot.svg' alt='dot' />
      )}

      {totalStep === 4 && (
        <>
          <Image pr='5px' src='/images/stepper/line.svg' alt='dot' />

          {currentStep === 4 ? (
            <Image src='/images/stepper/full-dot.svg' alt='dot' />
          ) : (
            <Image src='/images/stepper/empty-dot.svg' alt='dot' />
          )}
        </>
      )}
      {totalStep === 5 && (
        <>
          <Image pr='5px' src='/images/stepper/line.svg' alt='dot' />

          {currentStep >= 4 ? (
            <Image src='/images/stepper/full-dot.svg' alt='dot' />
          ) : (
            <Image src='/images/stepper/empty-dot.svg' alt='dot' />
          )}
          <Image pr='5px' src='/images/stepper/line.svg' alt='dot' />

          {currentStep === 5 ? (
            <Image src='/images/stepper/full-dot.svg' alt='dot' />
          ) : (
            <Image src='/images/stepper/empty-dot.svg' alt='dot' />
          )}
        </>
      )}
    </Flex>
  )
}

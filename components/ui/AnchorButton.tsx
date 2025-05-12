import { forwardRef } from 'react'
import { Button, type ButtonProps } from '@chakra-ui/react'
import type { AnchorHTMLAttributes } from 'react'

type AnchorButtonProps = ButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>

export const AnchorButton = forwardRef<HTMLButtonElement, AnchorButtonProps>(
  (props, ref) => <Button as='a' ref={ref} {...props} />
)

AnchorButton.displayName = 'AnchorButton'

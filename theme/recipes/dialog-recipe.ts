import { defineSlotRecipe } from '@chakra-ui/react'
import { dialogAnatomy } from '@chakra-ui/react/anatomy'

export const dialogRecipe = defineSlotRecipe({
  slots: dialogAnatomy.keys(),
  base: {
    backdrop: {
      bg: '#171923D9',
      backdropFilter: 'blur(5px)'
    },
    header: {
      pt: '16px !important',
      pb: '11px !important',
      px: '16px !important'
    },
    content: {
      w: { base: '100%', md: '480px' },
      bg: 'white',
      borderRadius: '16px',
      borderBottomRadius: { base: 0, md: '16px' },
      pb: '40px !important',
      pos: { base: 'fixed', md: 'relative' },
      bottom: { base: 0, md: 'auto' }
    },
    body: {
      pt: '0px !important',
      pb: '0px !important',
      px: { base: '24px !important', md: '40px !important' }
    }
  },
  variants: {
    size: {
      xl: {} // keeps the “xl” keyword so <Dialog size="xl" /> still works
    }
  },
  defaultVariants: {
    size: 'xl'
  }
})

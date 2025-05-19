import { defineSlotRecipe } from '@chakra-ui/react'

export const dialogRecipe = defineSlotRecipe({
  slots: ['backdrop', 'header', 'content', 'body'],

  // ---- base ----
  base: {
    /** overlay in v2 → backdrop in v3 */
    backdrop: {
      bg: '#171923D9',
      backdropFilter: 'blur(5px)'
    },

    /** header stays header */
    header: {
      pt: '16px',
      pb: '11px',
      px: '16px'
    },

    /** dialog in v2 → content in v3 */
    content: {
      w: { base: '100%', md: '480px' },
      borderRadius: '16px',
      borderBottomRadius: { base: 0, md: '16px' },
      pb: '40px',
      pos: { base: 'fixed', md: 'relative' },
      bottom: { base: 0, md: 'auto' },
      maxHeight: 'calc(100% - 1.5rem)'
    },

    /** body stays body */
    body: {
      pt: '0px',
      pb: '0px',
      px: { base: '24px', md: '40px' }
    }
  },

  // ---- variants ----
  variants: {
    size: {
      xl: {} // keeps the “xl” keyword so <Dialog size="xl" /> still works
    }
  },

  // ---- defaults ----
  defaultVariants: {
    size: 'xl'
  }
})

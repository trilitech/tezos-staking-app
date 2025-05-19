import { defineRecipe } from '@chakra-ui/react'

export const buttonRecipe = defineRecipe({
  // ---- base ----
  base: {
    borderRadius: '4px',
    fontFamily: 'var(--font-raptor-v2)'
  },

  // ---- variants ----
  variants: {
    size: {
      md: { fontSize: '18px', fontWeight: '700' }
    },
    primary: {
      true: {
        color: 'white',
        display: 'flex',
        minW: '161px',
        h: '48px',
        px: '24px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '8px',
        bg: '#171923',
        _hover: { bg: '#1A202C' },
        _disabled: { bg: '#E2E8F0' }
      }
    },
    secondary: {
      true: {
        color: '#0052FF',
        display: 'flex',
        minW: '161px',
        h: '48px',
        px: '24px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '8px',
        border: '2px solid #0052FF',
        bg: 'white',
        _hover: { bg: '#0052FF', color: 'white' },
        _disabled: { bg: '#E2E8F0' }
      }
    },
    ternary: {
      true: {
        color: 'white',
        display: 'flex',
        h: '48px',
        px: '24px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
        borderRadius: '8px',
        _hover: { bg: 'rgba(255,255,255,.04)' }
      }
    },
    quaternary: {
      true: {
        lineHeight: '16px',
        bg: 'teal.800',
        color: 'white',
        w: 'full',
        h: '56px',
        _hover: { bg: 'teal.700' }
      }
    },
    outline: {
      true: {
        lineHeight: '16px',
        border: '1px solid',
        borderColor: 'purple.500',
        w: 'full',
        h: '56px',
        color: 'teal.800',
        _hover: { bg: 'purple.700', color: 'teal.800' }
      }
    },
    ghost: {
      true: {
        bg: 'transparent',
        color: 'purple.200',
        w: 'full',
        h: '56px',
        _hover: { bg: 'transparent' },
        _focus: { bg: 'transparent' }
      }
    },
    white: {
      true: {
        bg: '#ffffff',
        color: 'black',
        w: 'full',
        _hover: { bg: 'gray.100' }
      }
    },
    buy: {
      true: {
        bg: 'linear-gradient(90deg,#5BFFA5 0%,#AA86FF 100%)',
        color: 'gray.975',
        w: 'full',
        h: '56px',
        _hover: { bg: 'blue.600' }
      }
    }
  }
})

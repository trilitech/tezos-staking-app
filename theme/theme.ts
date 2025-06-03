import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { buttonRecipe } from './recipes/button.recipe'
import { dialogRecipe } from './recipes/dialog-recipe'

const customConfig = defineConfig({
  globalCss: {
    body: {
      bg: '#F0F0FF',
      fontFamily: 'Inter, sans-serif',
      color: 'black'
    }
  },
  theme: {
    breakpoints: {
      sm: '570px', // Mobile -> Tablet
      md: '900px', // Tablet -> Desktop
      lg: '1440px', // Rest can for the most part be ignored
      xl: '1800px',
      '2xl': '2000px'
    },
    tokens: {
      colors: {
        gray: {
          50: { value: '#F7FAFC' },
          100: { value: '#EDF2F7' },
          200: { value: '#E2E8F0' },
          300: { value: '#CBD5E0' },
          400: { value: '#A0AEC0' },
          500: { value: '#718096' },
          600: { value: '#4A5568' },
          700: { value: '#2D3748' },
          800: { value: '#1A202C' },
          900: { value: '#171923' }
        },
        green: { DEFAULT: { value: '#38A169' } },
        darkGreen: { DEFAULT: { value: '#25855A' } },
        blue: { DEFAULT: { value: '#0052FF' } },
        darkBlue: { DEFAULT: { value: '#003EE0' } },
        red: { DEFAULT: { value: '#E53E3E' } },
        darkRed: { DEFAULT: { value: '#C53030' } }
      },
      shadows: {
        customShadow: { value: '0px 2px 12px 0px rgba(20, 20, 43, 0.08)' }
      }
    },
    recipes: {
      button: buttonRecipe
    },
    slotRecipes: {
      dialog: dialogRecipe
    }
  }
})

export const system = createSystem(defaultConfig, customConfig)

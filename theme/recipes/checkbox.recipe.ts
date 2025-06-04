import { defineRecipe } from '@chakra-ui/react'

export const checkboxRecipe = defineRecipe({
  base: {
    w: '20px',
    h: '20px',
    borderColor: '#b8bec4',
    _focus: {
      boxShadow: 'none'
    },
    _checked: {
      bg: '#0052FF',
      borderColor: '#0052FF',
      color: 'white',
      _hover: {
        bg: '#0052FF',
        borderColor: '#0052FF'
      }
    }
  }
  //   icon: {
  //     bg: '#0052FF'
  //   }
})

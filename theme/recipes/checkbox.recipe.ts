import { defineSlotRecipe } from '@chakra-ui/react'
import { checkboxAnatomy } from '@chakra-ui/react/anatomy'

export const checkboxRecipe = defineSlotRecipe({
  slots: checkboxAnatomy.keys(),
  base: {
    control: {
      border: '2px solid #b8bec4',
      w: '20px',
      h: '20px',
      _focus: {
        boxShadow: 'none'
      },
      _checked: {
        bg: '#0052FF !important',
        borderColor: '#0052FF !important',
        color: 'white !important',
        _hover: {
          bg: '#0052FF !important',
          borderColor: '#0052FF !important',
          cursor: 'pointer'
        }
      }
    }
  }
})

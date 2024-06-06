import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    body: 'Inter, sans-serif'
  },
  components: {
    Modal: {
      defaultProps: {
        size: 'lg'
      },
      baseStyle: {
        overlay: {
          bg: '#171923D9',
          backdropFilter: 'blur(5px)'
        },
        header: {
          pt: '16px',
          pb: '11px',
          px: '16px'
        },
        dialog: {
          w: { base: '100%', md: '464px' },
          borderRadius: '16px',
          pb: '40px',
          pos: { base: 'fixed', md: 'block' },
          bottom: { base: 0, md: 'auto' }
        },
        body: {
          pt: '0px',
          px: '32px'
        }
      }
    },
    Checkbox: {
      baseStyle: {
        control: {
          width: '20px',
          height: '20px',
          borderColor: '#E0E0E0',
          _checked: {
            bg: '#0052FF',
            borderColor: '#0052FF',
            color: 'white',
            _hover: {
              bg: '#0052FF',
              borderColor: '#0052FF'
            }
          },
          _focus: {
            boxShadow: 'none'
          }
        },
        icon: {
          bg: '#0052FF'
        }
      }
    }
  }
})

export default theme

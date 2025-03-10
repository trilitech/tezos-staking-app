import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  breakpoints: {
    sm: '570px', // Mobile -> Tablet
    md: '900px', // Tablet -> Desktop
    lg: '1440px', // Rest can for the most part be ignored
    xl: '1800px',
    '2xl': '2000px'
  },
  styles: {
    global: {
      body: {
        bg: '#F0F0FF'
      }
    }
  },
  fonts: {
    body: 'Inter, sans-serif'
  },
  colors: {
    gray: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923'
    },
    green: '#38A169',
    darkGreen: '#25855A',
    blue: '#0052FF',
    darkBlue: '#003EE0',
    red: '#E53E3E',
    darkRed: '#C53030'
  },
  components: {
    Modal: {
      defaultProps: {
        size: 'xl'
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
          w: { base: '100%', md: '480px' },
          borderRadius: '16px',
          borderBottomRadius: { base: 0, md: '16px' },
          pb: '40px',
          pos: { base: 'fixed', md: 'relative' },
          bottom: { base: 0, md: 'auto' },
          maxHeight: 'calc(100% - 1.5rem)'
        },
        body: {
          pt: '0px',
          pb: '0px',
          px: { base: '24px', md: '40px' }
        }
      }
    },
    Checkbox: {
      baseStyle: {
        control: {
          width: '20px',
          height: '20px',
          borderColor: '#b8bec4',
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
    },
    Button: {
      baseStyle: {
        borderRadius: '4px',
        fontFamily: 'var(--font-raptor-v2)'
      },
      sizes: {
        md: {
          fontSize: '18px',
          fontWeight: '700'
        }
      },
      variants: {
        primary: {
          color: 'white',
          display: 'flex',
          minWidth: '161px',
          height: '48px',
          padding: '0px 24px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '8px',
          background: '#171923',
          _hover: {
            bg: '#1A202C;'
          },
          _disabled: {
            bg: '#E2E8F0'
          }
        },
        secondary: {
          color: '#0052FF',
          display: 'flex',
          minWidth: '161px',
          height: '48px',
          padding: '0px 24px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '8px',
          border: '2px solid #0052FF',
          background: 'white',
          _hover: {
            bg: '#0052FF',
            color: 'white'
          },
          _disabled: {
            bg: '#E2E8F0'
          }
        },
        ternary: {
          color: 'white',
          display: 'flex',
          height: '48px',
          padding: '0px 24px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
          borderRadius: '8px',
          _hover: {
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.04)'
          }
        },
        quaternary: {
          lineHeight: '16px',
          bg: 'teal.800',
          color: 'white',
          w: 'full',
          h: '56px',
          _hover: {
            bg: 'teal.700'
          }
        },
        outline: {
          lineHeight: '16px',
          border: '1px solid',
          borderColor: 'purple.500',
          w: 'full',
          h: '56px',
          color: 'teal.800',
          _hover: {
            bg: 'purple.700',
            color: 'teal.800'
          }
        },
        ghost: {
          bg: 'transparent',
          color: 'purple.200',
          w: 'full',
          h: '56px',
          _hover: {
            bg: 'transparent'
          },
          _focus: {
            bg: 'transparent'
          }
        },
        white: {
          bg: '#ffffff',
          color: 'black',
          w: 'full',
          _hover: {
            bg: 'gray.100'
          }
        },
        buy: {
          bg: 'linear-gradient(90deg, #5BFFA5 0%, #AA86FF 100%)',
          color: 'gray.975',
          w: 'full',
          h: '56px',
          _hover: {
            bg: 'blue.600'
          }
        }
      }
    }
  },
  shadows: {
    customShadow: '0px 2px 12px 0px rgba(20, 20, 43, 0.08)'
  }
})

export default theme

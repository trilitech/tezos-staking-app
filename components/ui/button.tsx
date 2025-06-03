import type { RecipeVariantProps } from '@chakra-ui/react'
import { buttonRecipe } from '@/theme/recipes/button.recipe'

type ButtonVariantProps = RecipeVariantProps<typeof buttonRecipe>

export interface ButtonProps
  extends React.PropsWithChildren<ButtonVariantProps> {}

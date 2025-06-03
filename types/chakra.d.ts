import { RecipeComponentProps } from '@chakra-ui/react'
import { buttonRecipe } from '../theme/recipes/button.recipe'

type VisualVariants = keyof typeof buttonRecipe.variants.visual
type SizeVariants = keyof typeof buttonRecipe.variants.size

declare module '@chakra-ui/react' {
  export interface ButtonProps
    extends RecipeComponentProps<typeof buttonRecipe> {}
}

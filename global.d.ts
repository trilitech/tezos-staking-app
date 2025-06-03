import { RecipeComponentProps } from '@chakra-ui/react'
// Use a **relative** import to your recipe file:
import { buttonRecipe } from './theme/recipes/button.recipe'

// Now augment the ButtonProps interface so it includes `visual` (and any other recipe props)
declare module '@chakra-ui/react' {
  export interface ButtonProps
    extends RecipeComponentProps<typeof buttonRecipe> {}
}

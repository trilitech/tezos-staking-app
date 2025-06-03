import { RecipeComponentProps } from '@chakra-ui/react'
import { buttonRecipe } from '@/theme/recipes/button.recipe'

// Step 1: pull in the names of your recipe’s “visual” variants
type VisualVariants = keyof typeof buttonRecipe.variants.visual

// Step 2: pull in the names of your recipe’s “size” variants (if you want TS on size as well)
type SizeVariants = keyof typeof buttonRecipe.variants.size

// Step 3: now augment Chakra’s ButtonProps
declare module '@chakra-ui/react' {
  export interface ButtonProps
    extends RecipeComponentProps<typeof buttonRecipe> {}
}

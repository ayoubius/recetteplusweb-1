
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRecipeProducts = (recipeId: string) => {
  return useQuery({
    queryKey: ['recipe-products', recipeId],
    queryFn: async () => {
      const { data: recipe } = await supabase
        .from('recipes')
        .select('ingredients')
        .eq('id', recipeId)
        .single();

      if (!recipe?.ingredients) {
        return [];
      }

      // S'assurer que ingredients est un tableau
      let ingredients: any[] = [];
      if (Array.isArray(recipe.ingredients)) {
        ingredients = recipe.ingredients;
      } else if (typeof recipe.ingredients === 'string') {
        try {
          const parsed = JSON.parse(recipe.ingredients);
          ingredients = Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      } else if (typeof recipe.ingredients === 'object' && recipe.ingredients !== null) {
        // Si c'est un objet, essayer de l'utiliser comme tableau
        ingredients = Array.isArray((recipe.ingredients as any)) ? (recipe.ingredients as any) : [];
      }

      // Gérer les deux formats possibles : productId et product_id
      const productIds = ingredients
        .map((ingredient: any) => ingredient.productId || ingredient.product_id)
        .filter(Boolean);

      if (productIds.length === 0) return [];

      const { data: products } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      return products?.map(product => {
        const ingredient = ingredients.find((ing: any) => 
          (ing.productId || ing.product_id) === product.id
        );
        return {
          ...product,
          recipeQuantity: ingredient?.quantity || 1,
          unit: ingredient?.unit || product.unit
        };
      }) || [];
    },
    enabled: !!recipeId,
  });
};

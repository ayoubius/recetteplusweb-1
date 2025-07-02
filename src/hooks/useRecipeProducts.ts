
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

      if (!recipe?.ingredients || !Array.isArray(recipe.ingredients)) {
        return [];
      }

      const productIds = recipe.ingredients
        .map((ingredient: any) => ingredient.product_id)
        .filter(Boolean);

      if (productIds.length === 0) return [];

      const { data: products } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      return products?.map(product => {
        const ingredient = recipe.ingredients.find((ing: any) => ing.product_id === product.id);
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

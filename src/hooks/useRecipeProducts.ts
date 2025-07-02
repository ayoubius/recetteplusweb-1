
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRecipeProducts = (recipeId: string) => {
  return useQuery({
    queryKey: ['recipe-products', recipeId],
    queryFn: async () => {
      const { data: recipe, error } = await supabase
        .from('recipes')
        .select('ingredients')
        .eq('id', recipeId)
        .single();

      if (error) throw error;

      const ingredients = recipe.ingredients as Array<{
        productId: string;
        quantity: string;
        unit: string;
      }>;

      if (!ingredients || ingredients.length === 0) return [];

      const productIds = ingredients.map(ing => ing.productId);
      
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (productsError) throw productsError;

      return ingredients.map(ingredient => {
        const product = products?.find(p => p.id === ingredient.productId);
        return {
          ...ingredient,
          product
        };
      }).filter(item => item.product);
    },
    enabled: !!recipeId,
  });
};

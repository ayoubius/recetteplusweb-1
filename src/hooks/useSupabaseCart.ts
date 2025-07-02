
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';

export const useRecipeUserCarts = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['recipe-user-carts', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      
      const { data, error } = await supabase
        .from('recipe_user_carts')
        .select(`
          *,
          recipe_cart_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentUser,
  });

  const createRecipeCart = useMutation({
    mutationFn: async ({ 
      recipeId, 
      cartName, 
      ingredients 
    }: { 
      recipeId: string; 
      cartName: string; 
      ingredients: Array<{productId: string, quantity: number}>; 
    }) => {
      if (!currentUser) throw new Error('User not authenticated');

      // Créer le panier recette
      const { data: recipeCart, error: cartError } = await supabase
        .from('recipe_user_carts')
        .insert({
          user_id: currentUser.id,
          recipe_id: recipeId,
          cart_name: cartName,
        })
        .select()
        .single();

      if (cartError) throw cartError;

      // Ajouter les items au panier
      const cartItems = ingredients.map(ingredient => ({
        recipe_cart_id: recipeCart.id,
        product_id: ingredient.productId,
        quantity: ingredient.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('recipe_cart_items')
        .insert(cartItems);

      if (itemsError) throw itemsError;

      return recipeCart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe-user-carts'] });
    },
    onError: (error) => {
      console.error('Error creating recipe cart:', error);
    },
  });

  return {
    ...query,
    createRecipeCart: createRecipeCart.mutate,
    isCreating: createRecipeCart.isPending,
  };
};

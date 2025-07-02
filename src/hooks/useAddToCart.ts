
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAddToCart = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      if (!currentUser) {
        throw new Error('Vous devez être connecté pour ajouter des produits au panier');
      }

      // D'abord, créer ou récupérer le panier personnel de l'utilisateur
      let { data: personalCart, error: cartError } = await supabase
        .from('personal_carts')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (cartError && cartError.code === 'PGRST116') {
        // Le panier n'existe pas, le créer
        const { data: newCart, error: createError } = await supabase
          .from('personal_carts')
          .insert({
            user_id: currentUser.id,
            is_added_to_main_cart: true
          })
          .select()
          .single();

        if (createError) throw createError;
        personalCart = newCart;
      } else if (cartError) {
        throw cartError;
      }

      // Vérifier si le produit existe déjà dans le panier
      const { data: existingItem, error: existingError } = await supabase
        .from('personal_cart_items')
        .select('*')
        .eq('personal_cart_id', personalCart!.id)
        .eq('product_id', productId)
        .single();

      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError;
      }

      if (existingItem) {
        // Mettre à jour la quantité
        const { data, error } = await supabase
          .from('personal_cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Ajouter un nouvel article
        const { data, error } = await supabase
          .from('personal_cart_items')
          .insert({
            personal_cart_id: personalCart!.id,
            product_id: productId,
            quantity: quantity
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-cart'] });
      queryClient.invalidateQueries({ queryKey: ['personal-cart-items'] });
      toast({
        title: "Produit ajouté au panier",
        description: "Le produit a été ajouté à votre panier personnel."
      });
    },
    onError: (error: any) => {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le produit au panier.",
        variant: "destructive"
      });
    }
  });

  const addToCart = async (productId: string, quantity: number = 1) => {
    setIsAdding(true);
    try {
      await addToCartMutation.mutateAsync({ productId, quantity });
    } finally {
      setIsAdding(false);
    }
  };

  return {
    addToCart,
    isAdding: isAdding || addToCartMutation.isPending
  };
};

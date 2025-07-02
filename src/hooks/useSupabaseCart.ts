
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';

// Hook pour les paniers recettes utilisateur (déjà existant)
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
          ),
          recipes (*)
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
      toast({
        title: "Panier recette créé",
        description: "Le panier recette a été créé avec succès."
      });
    },
    onError: (error) => {
      console.error('Error creating recipe cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le panier recette.",
        variant: "destructive"
      });
    },
  });

  const addToMainCart = useMutation({
    mutationFn: async (recipeCartId: string) => {
      const { error } = await supabase
        .from('recipe_user_carts')
        .update({ is_added_to_main_cart: true })
        .eq('id', recipeCartId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe-user-carts'] });
      queryClient.invalidateQueries({ queryKey: ['main-cart'] });
      toast({
        title: "Ajouté au panier principal",
        description: "Le panier recette a été ajouté au panier principal."
      });
    },
  });

  const removeRecipeCart = useMutation({
    mutationFn: async (recipeCartId: string) => {
      const { error } = await supabase
        .from('recipe_user_carts')
        .delete()
        .eq('id', recipeCartId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe-user-carts'] });
      toast({
        title: "Panier supprimé",
        description: "Le panier recette a été supprimé."
      });
    },
  });

  return {
    ...query,
    recipeCarts: query.data || [],
    createRecipeCart: createRecipeCart.mutate,
    isCreating: createRecipeCart.isPending,
    addToMainCart: addToMainCart.mutate,
    isAddingToMain: addToMainCart.isPending,
    removeRecipeCart: removeRecipeCart.mutate,
    isRemoving: removeRecipeCart.isPending,
  };
};

// Hook pour le panier personnel
export const usePersonalCart = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer le panier personnel
  const personalCartQuery = useQuery({
    queryKey: ['personal-cart', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return null;

      const { data, error } = await supabase
        .from('personal_carts')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!currentUser,
  });

  // Récupérer les items du panier personnel
  const personalCartItemsQuery = useQuery({
    queryKey: ['personal-cart-items', personalCartQuery.data?.id],
    queryFn: async () => {
      if (!personalCartQuery.data?.id) return [];

      const { data, error } = await supabase
        .from('personal_cart_items')
        .select(`
          *,
          products (*)
        `)
        .eq('personal_cart_id', personalCartQuery.data.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!personalCartQuery.data?.id,
  });

  // Créer ou récupérer le panier personnel
  const getOrCreatePersonalCart = async () => {
    if (!currentUser) throw new Error('User not authenticated');

    let cart = personalCartQuery.data;
    if (!cart) {
      const { data, error } = await supabase
        .from('personal_carts')
        .insert({ user_id: currentUser.id })
        .select()
        .single();

      if (error) throw error;
      cart = data;
      queryClient.setQueryData(['personal-cart', currentUser.id], cart);
    }
    return cart;
  };

  // Ajouter un produit au panier personnel
  const addToPersonalCart = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const cart = await getOrCreatePersonalCart();

      // Vérifier si le produit existe déjà
      const existingItem = personalCartItemsQuery.data?.find(item => item.product_id === productId);

      if (existingItem) {
        // Mettre à jour la quantité
        const { error } = await supabase
          .from('personal_cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Ajouter un nouvel item
        const { error } = await supabase
          .from('personal_cart_items')
          .insert({
            personal_cart_id: cart.id,
            product_id: productId,
            quantity,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-cart-items'] });
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à votre panier personnel."
      });
    },
    onError: (error) => {
      console.error('Error adding to personal cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier.",
        variant: "destructive"
      });
    },
  });

  // Mettre à jour la quantité d'un item
  const updateQuantity = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase
          .from('personal_cart_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('personal_cart_items')
          .update({ quantity })
          .eq('id', itemId);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-cart-items'] });
    },
  });

  // Supprimer un item
  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('personal_cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-cart-items'] });
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé de votre panier."
      });
    },
  });

  return {
    personalCart: personalCartQuery.data,
    personalCartItems: personalCartItemsQuery.data || [],
    isLoading: personalCartQuery.isLoading || personalCartItemsQuery.isLoading,
    addToPersonalCart: addToPersonalCart.mutate,
    isAdding: addToPersonalCart.isPending,
    updateQuantity: updateQuantity.mutate,
    isUpdating: updateQuantity.isPending,
    removeItem: removeItem.mutate,
    isRemoving: removeItem.isPending,
  };
};

// Hook pour le panier principal (combinaison de tous les paniers)
export const useMainCart = () => {
  const { currentUser } = useAuth();
  const { personalCartItems } = usePersonalCart();
  const { recipeCarts } = useRecipeUserCarts();

  // Récupérer le panier principal de l'utilisateur
  const mainCartQuery = useQuery({
    queryKey: ['main-cart', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return null;

      const { data, error } = await supabase
        .from('user_carts')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!currentUser,
  });

  // Combiner tous les items du panier
  const cartItems = [
    ...personalCartItems,
    ...recipeCarts.filter(cart => cart.is_added_to_main_cart).flatMap(cart => 
      cart.recipe_cart_items?.map(item => ({
        ...item,
        source: 'recipe',
        recipeCart: cart
      })) || []
    )
  ];

  return {
    mainCart: mainCartQuery.data,
    cartItems,
    isLoading: mainCartQuery.isLoading,
  };
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { MainCartItem } from '@/types/cart';

// Hook pour les paniers recettes utilisateur
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
      if (!currentUser) {
        throw new Error('Vous devez être connecté pour créer un panier recette');
      }

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
      queryClient.invalidateQueries({ queryKey: ['main-cart'] });
      toast({
        title: "Panier recette créé",
        description: "Le panier recette a été créé avec succès."
      });
    },
    onError: (error) => {
      console.error('Error creating recipe cart:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le panier recette.",
        variant: "destructive"
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
      queryClient.invalidateQueries({ queryKey: ['main-cart'] });
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
    if (!currentUser) throw new Error('Vous devez être connecté pour ajouter des produits au panier');

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
      queryClient.invalidateQueries({ queryKey: ['main-cart'] });
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à votre panier personnel."
      });
    },
    onError: (error) => {
      console.error('Error adding to personal cart:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le produit au panier.",
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
      queryClient.invalidateQueries({ queryKey: ['main-cart'] });
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
      queryClient.invalidateQueries({ queryKey: ['main-cart'] });
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

// Hook pour le panier principal
export const useMainCart = () => {
  const { currentUser } = useAuth();

  const mainCartQuery = useQuery({
    queryKey: ['main-cart', currentUser?.id],
    queryFn: async (): Promise<MainCartItem[]> => {
      if (!currentUser) return [];

      try {
        // Utiliser une requête directe pour récupérer les données
        const { data, error } = await supabase
          .from('personal_carts')
          .select(`
            id,
            user_id,
            personal_cart_items (
              id,
              product_id,
              quantity,
              products (
                name,
                price
              )
            )
          `)
          .eq('user_id', currentUser.id);

        if (error) {
          console.error('Error fetching personal cart:', error);
        }

        // Construire les données manuellement pour le moment
        return await buildMainCartManually(currentUser.id);
      } catch (error) {
        console.error('Error in main cart query:', error);
        return [];
      }
    },
    enabled: !!currentUser,
  });

  return {
    cartItems: mainCartQuery.data || [],
    isLoading: mainCartQuery.isLoading,
  };
};

// Fonction pour construire le panier principal manuellement
async function buildMainCartManually(userId: string): Promise<MainCartItem[]> {
  const cartItems: MainCartItem[] = [];

  try {
    // Récupérer les items du panier personnel
    const { data: personalCartData } = await supabase
      .from('personal_carts')
      .select(`
        id,
        personal_cart_items (
          id,
          product_id,
          quantity,
          products (name, price)
        )
      `)
      .eq('user_id', userId)
      .single();

    if (personalCartData?.personal_cart_items) {
      personalCartData.personal_cart_items.forEach((item: any) => {
        cartItems.push({
          user_id: userId,
          cart_type: 'personal',
          cart_id: personalCartData.id,
          cart_name: 'Panier Personnel',
          item_id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          product_name: item.products?.name || '',
          unit_price: item.products?.price || 0,
          total_price: (item.products?.price || 0) * item.quantity,
        });
      });
    }

    // Récupérer les paniers recettes
    const { data: recipeCartsData } = await supabase
      .from('recipe_user_carts')
      .select(`
        id,
        cart_name,
        recipe_cart_items (
          id,
          product_id,
          quantity,
          products (name, price)
        )
      `)
      .eq('user_id', userId);

    recipeCartsData?.forEach((cart: any) => {
      cart.recipe_cart_items?.forEach((item: any) => {
        cartItems.push({
          user_id: userId,
          cart_type: 'recipe',
          cart_id: cart.id,
          cart_name: cart.cart_name,
          item_id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          product_name: item.products?.name || '',
          unit_price: item.products?.price || 0,
          total_price: (item.products?.price || 0) * item.quantity,
        });
      });
    });

    // Récupérer les paniers préconfigurés
    const { data: userPreconfiguredCarts } = await supabase
      .from('user_preconfigured_carts')
      .select(`
        id,
        preconfigured_carts (
          name,
          total_price
        )
      `)
      .eq('user_id', userId);

    userPreconfiguredCarts?.forEach((userCart: any) => {
      cartItems.push({
        user_id: userId,
        cart_type: 'preconfigured',
        cart_id: userCart.id,
        cart_name: userCart.preconfigured_carts?.name || '',
        item_id: userCart.id,
        product_id: null,
        quantity: 1,
        product_name: userCart.preconfigured_carts?.name || '',
        unit_price: userCart.preconfigured_carts?.total_price || 0,
        total_price: userCart.preconfigured_carts?.total_price || 0,
      });
    });

  } catch (error) {
    console.error('Error building main cart manually:', error);
  }

  return cartItems;
}

// Hook pour les paniers préconfigurés
export const usePreconfiguredCarts = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addPreconfiguredCartToPersonal = useMutation({
    mutationFn: async (cartId: string) => {
      if (!currentUser) {
        throw new Error('Vous devez être connecté pour ajouter ce panier');
      }

      // Récupérer les détails du panier préconfiguré
      const { data: preconfiguredCart, error: fetchError } = await supabase
        .from('preconfigured_carts')
        .select('*')
        .eq('id', cartId)
        .single();

      if (fetchError) throw fetchError;

      // Créer une entrée dans user_preconfigured_carts
      const { data: userPreconfiguredCart, error: userCartError } = await supabase
        .from('user_preconfigured_carts')
        .insert({
          user_id: currentUser.id,
          preconfigured_cart_id: cartId,
        })
        .select()
        .single();

      if (userCartError) throw userCartError;

      return { preconfiguredCart, userPreconfiguredCart };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-preconfigured-carts'] });
      queryClient.invalidateQueries({ queryKey: ['main-cart'] });
      toast({
        title: "Panier ajouté",
        description: `Le panier "${data.preconfiguredCart.name}" a été ajouté à vos paniers.`
      });
    },
    onError: (error) => {
      console.error('Error adding preconfigured cart:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le panier.",
        variant: "destructive"
      });
    },
  });

  // Hook pour récupérer les paniers préconfigurés de l'utilisateur
  const userPreconfiguredCartsQuery = useQuery({
    queryKey: ['user-preconfigured-carts', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];

      const { data, error } = await supabase
        .from('user_preconfigured_carts')
        .select(`
          *,
          preconfigured_carts (*)
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentUser,
  });

  // Mutation pour supprimer un panier préconfiguré
  const removeUserCart = useMutation({
    mutationFn: async (userCartId: string) => {
      const { error } = await supabase
        .from('user_preconfigured_carts')
        .delete()
        .eq('id', userCartId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preconfigured-carts'] });
      queryClient.invalidateQueries({ queryKey: ['main-cart'] });
      toast({
        title: "Panier supprimé",
        description: "Le panier préconfiguré a été supprimé."
      });
    },
  });

  return {
    addPreconfiguredCartToPersonal: addPreconfiguredCartToPersonal.mutate,
    isAdding: addPreconfiguredCartToPersonal.isPending,
    userPreconfiguredCarts: userPreconfiguredCartsQuery.data || [],
    isLoadingUserCarts: userPreconfiguredCartsQuery.isLoading,
    removeUserCart: removeUserCart.mutate,
    isRemoving: removeUserCart.isPending,
  };
};

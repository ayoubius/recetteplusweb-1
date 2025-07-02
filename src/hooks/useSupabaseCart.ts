
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UserCart {
  id: string;
  user_id: string;
  total_price: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserCartItem {
  id: string;
  user_cart_id: string;
  cart_reference_type: 'personal' | 'recipe' | 'preconfigured';
  cart_reference_id: string;
  cart_name: string;
  cart_total_price: number | null;
  items_count: number | null;
  created_at: string;
}

export interface PersonalCartItem {
  id: string;
  personal_cart_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  products?: {
    name: string;
    image: string | null;
    category: string;
    price: number;
  };
}

export interface RecipeUserCart {
  id: string;
  user_id: string;
  recipe_id: string;
  cart_name: string;
  is_added_to_main_cart: boolean | null;
  created_at: string;
  recipes?: {
    title: string;
    image: string | null;
  };
}

export interface PersonalCart {
  id: string;
  user_id: string;
  is_added_to_main_cart: boolean | null;
  created_at: string;
  updated_at: string;
}

// Hook pour le panier principal
export const useMainCart = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ['mainCart', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) throw new Error('User not authenticated');

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

  const cartItemsQuery = useQuery({
    queryKey: ['mainCartItems', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_cart_items')
        .select('*')
        .eq('user_cart_id', cartQuery.data?.id || '')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserCartItem[];
    },
    enabled: !!currentUser && !!cartQuery.data?.id,
  });

  const createCartMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_carts')
        .insert([{ user_id: currentUser.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mainCart', currentUser?.id] });
    },
  });

  const removeCartItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      // Récupérer les informations de l'item pour supprimer le panier source
      const { data: cartItem, error: getError } = await supabase
        .from('user_cart_items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (getError) throw getError;

      // Supprimer l'item du panier principal
      const { error: deleteError } = await supabase
        .from('user_cart_items')
        .delete()
        .eq('id', itemId);

      if (deleteError) throw deleteError;

      // Supprimer le panier source selon son type
      if (cartItem.cart_reference_type === 'personal') {
        await supabase
          .from('personal_carts')
          .delete()
          .eq('id', cartItem.cart_reference_id);
      } else if (cartItem.cart_reference_type === 'recipe') {
        await supabase
          .from('recipe_user_carts')
          .delete()
          .eq('id', cartItem.cart_reference_id);
      } else if (cartItem.cart_reference_type === 'preconfigured') {
        await supabase
          .from('user_preconfigured_carts')
          .delete()
          .eq('id', cartItem.cart_reference_id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mainCartItems', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['personalCart', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['recipeUserCarts', currentUser?.id] });
      toast({
        title: "Panier supprimé",
        description: "Le panier a été complètement supprimé",
      });
    },
  });

  return {
    cart: cartQuery.data,
    cartItems: cartItemsQuery.data || [],
    isLoading: cartQuery.isLoading || cartItemsQuery.isLoading,
    createCart: createCartMutation.mutate,
    removeCartItem: removeCartItemMutation.mutate,
    isCreatingCart: createCartMutation.isPending,
    isRemoving: removeCartItemMutation.isPending,
  };
};

// Hook pour les paniers recette
export const useRecipeUserCarts = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const recipeCartsQuery = useQuery({
    queryKey: ['recipeUserCarts', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('recipe_user_carts')
        .select(`
          *,
          recipes:recipe_id (
            title,
            image
          )
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!currentUser,
  });

  const createRecipeCartMutation = useMutation({
    mutationFn: async ({ recipeId, cartName, ingredients }: {
      recipeId: string;
      cartName: string;
      ingredients: Array<{ productId: string; quantity: number; }>;
    }) => {
      if (!currentUser) throw new Error('User not authenticated');

      // Créer le panier recette
      const { data: recipeCart, error: recipeCartError } = await supabase
        .from('recipe_user_carts')
        .insert([{
          user_id: currentUser.id,
          recipe_id: recipeId,
          cart_name: cartName,
          is_added_to_main_cart: true // Automatiquement ajouté
        }])
        .select()
        .single();

      if (recipeCartError) throw recipeCartError;

      // Ajouter les ingrédients
      const cartItems = ingredients.map(ingredient => ({
        recipe_cart_id: recipeCart.id,
        product_id: ingredient.productId,
        quantity: ingredient.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('recipe_cart_items')
        .insert(cartItems);

      if (itemsError) throw itemsError;

      // Calculer le total et nombre d'items
      const { data: itemsWithProducts, error: calcError } = await supabase
        .from('recipe_cart_items')
        .select(`
          *,
          products:product_id(price)
        `)
        .eq('recipe_cart_id', recipeCart.id);

      if (calcError) throw calcError;

      const itemsCount = itemsWithProducts.length;
      const totalPrice = itemsWithProducts.reduce((sum, item) => 
        sum + ((item.products?.price || 0) * item.quantity), 0
      );

      // Créer ou récupérer le panier principal
      let { data: mainCart } = await supabase
        .from('user_carts')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (!mainCart) {
        const { data: newCart, error: cartError } = await supabase
          .from('user_carts')
          .insert([{ user_id: currentUser.id }])
          .select()
          .single();

        if (cartError) throw cartError;
        mainCart = newCart;
      }

      // Ajouter automatiquement au panier principal
      const { error: mainCartError } = await supabase
        .from('user_cart_items')
        .insert([{
          user_cart_id: mainCart.id,
          cart_reference_type: 'recipe' as const,
          cart_reference_id: recipeCart.id,
          cart_name: cartName,
          cart_total_price: totalPrice,
          items_count: itemsCount,
        }]);

      if (mainCartError) throw mainCartError;

      return recipeCart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipeUserCarts', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['mainCart', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['mainCartItems', currentUser?.id] });
      toast({
        title: "Recette ajoutée",
        description: "Le panier recette a été automatiquement ajouté au panier principal",
      });
    },
  });

  const addToMainCartMutation = useMutation({
    mutationFn: async (recipeCartId: string) => {
      if (!currentUser) throw new Error('User not authenticated');

      // Marquer le panier recette comme ajouté
      const { error: updateError } = await supabase
        .from('recipe_user_carts')
        .update({ is_added_to_main_cart: true })
        .eq('id', recipeCartId);

      if (updateError) throw updateError;

      // Récupérer les informations du panier recette
      const { data: recipeCart, error: recipeCartError } = await supabase
        .from('recipe_user_carts')
        .select('*')
        .eq('id', recipeCartId)
        .single();

      if (recipeCartError) throw recipeCartError;

      // Calculer le total et nombre d'items
      const { data: itemsWithProducts, error: calcError } = await supabase
        .from('recipe_cart_items')
        .select(`
          *,
          products:product_id(price)
        `)
        .eq('recipe_cart_id', recipeCartId);

      if (calcError) throw calcError;

      const itemsCount = itemsWithProducts.length;
      const totalPrice = itemsWithProducts.reduce((sum, item) => 
        sum + ((item.products?.price || 0) * item.quantity), 0
      );

      // Créer ou récupérer le panier principal
      let { data: mainCart } = await supabase
        .from('user_carts')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (!mainCart) {
        const { data: newCart, error: cartError } = await supabase
          .from('user_carts')
          .insert([{ user_id: currentUser.id }])
          .select()
          .single();

        if (cartError) throw cartError;
        mainCart = newCart;
      }

      // Ajouter au panier principal
      const { error: mainCartError } = await supabase
        .from('user_cart_items')
        .insert([{
          user_cart_id: mainCart.id,
          cart_reference_type: 'recipe' as const,
          cart_reference_id: recipeCartId,
          cart_name: recipeCart.cart_name,
          cart_total_price: totalPrice,
          items_count: itemsCount,
        }]);

      if (mainCartError) throw mainCartError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipeUserCarts', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['mainCart', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['mainCartItems', currentUser?.id] });
      toast({
        title: "Panier ajouté",
        description: "Le panier recette a été ajouté au panier principal",
      });
    },
  });

  const removeRecipeCartMutation = useMutation({
    mutationFn: async (recipeCartId: string) => {
      // Supprimer les items du panier recette
      const { error: itemsError } = await supabase
        .from('recipe_cart_items')
        .delete()
        .eq('recipe_cart_id', recipeCartId);

      if (itemsError) throw itemsError;

      // Supprimer le panier recette
      const { error: cartError } = await supabase
        .from('recipe_user_carts')
        .delete()
        .eq('id', recipeCartId);

      if (cartError) throw cartError;

      // Supprimer du panier principal s'il y était
      const { error: mainCartError } = await supabase
        .from('user_cart_items')
        .delete()
        .eq('cart_reference_type', 'recipe')
        .eq('cart_reference_id', recipeCartId);

      if (mainCartError) throw mainCartError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipeUserCarts', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['mainCart', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['mainCartItems', currentUser?.id] });
      toast({
        title: "Panier supprimé",
        description: "Le panier recette a été supprimé",
      });
    },
  });

  return {
    recipeCarts: recipeCartsQuery.data || [],
    isLoading: recipeCartsQuery.isLoading,
    createRecipeCart: createRecipeCartMutation.mutate,
    addToMainCart: addToMainCartMutation.mutate,
    removeRecipeCart: removeRecipeCartMutation.mutate,
    isCreating: createRecipeCartMutation.isPending,
    isAddingToMain: addToMainCartMutation.isPending,
    isRemoving: removeRecipeCartMutation.isPending,
  };
};

// Hook pour le panier personnalisé
export const usePersonalCart = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const personalCartQuery = useQuery({
    queryKey: ['personalCart', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('personal_carts')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('is_added_to_main_cart', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!currentUser,
  });

  const personalCartItemsQuery = useQuery({
    queryKey: ['personalCartItems', currentUser?.id],
    queryFn: async () => {
      if (!currentUser || !personalCartQuery.data?.id) return [];

      const { data, error } = await supabase
        .from('personal_cart_items')
        .select(`
          *,
          products:product_id (
            name,
            image,
            category,
            price
          )
        `)
        .eq('personal_cart_id', personalCartQuery.data.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!currentUser && !!personalCartQuery.data?.id,
  });

  const addToPersonalCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (!currentUser) throw new Error('User not authenticated');

      let personalCart = personalCartQuery.data;

      // Créer un nouveau panier personnel s'il n'existe pas
      if (!personalCart) {
        const { data: newCart, error: cartError } = await supabase
          .from('personal_carts')
          .insert([{ 
            user_id: currentUser.id,
            is_added_to_main_cart: true // Automatiquement ajouté
          }])
          .select()
          .single();

        if (cartError) throw cartError;
        personalCart = newCart;

        // Créer ou récupérer le panier principal
        let { data: mainCart } = await supabase
          .from('user_carts')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

        if (!mainCart) {
          const { data: newMainCart, error: mainCartError } = await supabase
            .from('user_carts')
            .insert([{ user_id: currentUser.id }])
            .select()
            .single();

          if (mainCartError) throw mainCartError;
          mainCart = newMainCart;
        }

        // Ajouter le panier personnel au panier principal
        await supabase
          .from('user_cart_items')
          .insert([{
            user_cart_id: mainCart.id,
            cart_reference_type: 'personal' as const,
            cart_reference_id: personalCart.id,
            cart_name: 'Panier Personnel',
            cart_total_price: 0,
            items_count: 0,
          }]);
      }

      // Ajouter le produit au panier personnel
      const { data, error } = await supabase
        .from('personal_cart_items')
        .insert([{
          personal_cart_id: personalCart.id,
          product_id: productId,
          quantity,
        }])
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le total et le nombre d'items dans le panier principal
      const { data: allItems, error: itemsError } = await supabase
        .from('personal_cart_items')
        .select(`
          *,
          products:product_id(price)
        `)
        .eq('personal_cart_id', personalCart.id);

      if (itemsError) throw itemsError;

      const itemsCount = allItems.length;
      const totalPrice = allItems.reduce((sum, item) => 
        sum + ((item.products?.price || 0) * item.quantity), 0
      );

      // Mettre à jour l'item du panier principal
      await supabase
        .from('user_cart_items')
        .update({
          cart_total_price: totalPrice,
          items_count: itemsCount,
        })
        .eq('cart_reference_type', 'personal')
        .eq('cart_reference_id', personalCart.id);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalCart', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['personalCartItems', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['mainCart', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['mainCartItems', currentUser?.id] });
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à votre panier personnel",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (quantity <= 0) {
        // Supprimer l'item
        const { error } = await supabase
          .from('personal_cart_items')
          .delete()
          .eq('id', itemId);
        
        if (error) throw error;
      } else {
        // Mettre à jour la quantité
        const { error } = await supabase
          .from('personal_cart_items')
          .update({ quantity })
          .eq('id', itemId);
        
        if (error) throw error;
      }

      // Mettre à jour le total dans le panier principal
      if (personalCartQuery.data) {
        const { data: allItems, error: itemsError } = await supabase
          .from('personal_cart_items')
          .select(`
            *,
            products:product_id(price)
          `)
          .eq('personal_cart_id', personalCartQuery.data.id);

        if (itemsError) throw itemsError;

        const itemsCount = allItems.length;
        const totalPrice = allItems.reduce((sum, item) => 
          sum + ((item.products?.price || 0) * item.quantity), 0
        );

        await supabase
          .from('user_cart_items')
          .update({
            cart_total_price: totalPrice,
            items_count: itemsCount,
          })
          .eq('cart_reference_type', 'personal')
          .eq('cart_reference_id', personalCartQuery.data.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalCartItems', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['mainCartItems', currentUser?.id] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('personal_cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      // Mettre à jour le total dans le panier principal
      if (personalCartQuery.data) {
        const { data: allItems, error: itemsError } = await supabase
          .from('personal_cart_items')
          .select(`
            *,
            products:product_id(price)
          `)
          .eq('personal_cart_id', personalCartQuery.data.id);

        if (itemsError) throw itemsError;

        const itemsCount = allItems.length;
        const totalPrice = allItems.reduce((sum, item) => 
          sum + ((item.products?.price || 0) * item.quantity), 0
        );

        await supabase
          .from('user_cart_items')
          .update({
            cart_total_price: totalPrice,
            items_count: itemsCount,
          })
          .eq('cart_reference_type', 'personal')
          .eq('cart_reference_id', personalCartQuery.data.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalCartItems', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['mainCartItems', currentUser?.id] });
      toast({
        title: "Produit supprimé",
        description: "Le produit a été retiré de votre panier",
      });
    },
  });

  return {
    personalCart: personalCartQuery.data,
    personalCartItems: personalCartItemsQuery.data || [],
    isLoading: personalCartQuery.isLoading || personalCartItemsQuery.isLoading,
    addToPersonalCart: addToPersonalCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeItem: removeItemMutation.mutate,
    isAdding: addToPersonalCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeItemMutation.isPending,
  };
};

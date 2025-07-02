
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customCartService, recipeCartService } from '@/lib/firestore-cart';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCustomCart = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ['customCart', currentUser?.id],
    queryFn: () => customCartService.getCartItems(currentUser!.id),
    enabled: !!currentUser,
  });

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      customCartService.addToCart(currentUser!.id, productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customCart', currentUser?.id] });
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à votre panier personnalisé",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier",
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
      customCartService.updateQuantity(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customCart', currentUser?.id] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (cartItemId: string) => customCartService.removeFromCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customCart', currentUser?.id] });
      toast({
        title: "Produit supprimé",
        description: "Le produit a été retiré de votre panier",
      });
    },
  });

  return {
    ...cartQuery,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
  };
};

export const useRecipeCart = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const recipeCartsQuery = useQuery({
    queryKey: ['recipeCarts', currentUser?.id],
    queryFn: () => recipeCartService.getRecipeCarts(currentUser!.id),
    enabled: !!currentUser,
  });

  const addRecipeToCartMutation = useMutation({
    mutationFn: ({ recipeId, recipeName, ingredients }: { 
      recipeId: string; 
      recipeName: string; 
      ingredients: Array<{productId: string, quantity: number}> 
    }) => recipeCartService.addRecipeToCart(currentUser!.id, recipeId, recipeName, ingredients),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipeCarts', currentUser?.id] });
      toast({
        title: "Recette ajoutée",
        description: "La recette et ses ingrédients ont été ajoutés à votre panier",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la recette au panier",
        variant: "destructive",
      });
    },
  });

  const removeRecipeFromCartMutation = useMutation({
    mutationFn: (recipeCartId: string) => recipeCartService.removeRecipeFromCart(recipeCartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipeCarts', currentUser?.id] });
      toast({
        title: "Recette supprimée",
        description: "La recette a été retirée de votre panier",
      });
    },
  });

  return {
    ...recipeCartsQuery,
    addRecipeToCart: addRecipeToCartMutation.mutate,
    removeRecipeFromCart: removeRecipeFromCartMutation.mutate,
    isAddingRecipe: addRecipeToCartMutation.isPending,
    isRemovingRecipe: removeRecipeFromCartMutation.isPending,
  };
};

// Hook pour maintenir la compatibilité avec l'ancien code
export const useCart = useCustomCart;

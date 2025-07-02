
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Favorite {
  id: string;
  user_id: string;
  item_id: string;
  type: 'recipe' | 'product' | 'video';
  created_at: string;
}

export const useSupabaseFavorites = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ['favorites', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }

      return data as Favorite[];
    },
    enabled: !!currentUser,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async ({ itemId, type }: { itemId: string; type: 'recipe' | 'product' | 'video' }) => {
      if (!currentUser) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: currentUser.id,
          item_id: itemId,
          type: type
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', currentUser?.id] });
      toast({
        title: "Ajouté aux favoris",
        description: "L'élément a été ajouté à vos favoris",
      });
    },
    onError: (error: any) => {
      console.error('Error adding favorite:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter aux favoris",
        variant: "destructive",
      });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async ({ itemId, type }: { itemId: string; type: 'recipe' | 'product' | 'video' }) => {
      if (!currentUser) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('item_id', itemId)
        .eq('type', type);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', currentUser?.id] });
      toast({
        title: "Retiré des favoris",
        description: "L'élément a été retiré de vos favoris",
      });
    },
    onError: (error: any) => {
      console.error('Error removing favorite:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer des favoris",
        variant: "destructive",
      });
    },
  });

  const isFavorite = (itemId: string, type: 'recipe' | 'product' | 'video') => {
    return favoritesQuery.data?.some(fav => fav.item_id === itemId && fav.type === type) || false;
  };

  return {
    ...favoritesQuery,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
    isAddingFavorite: addFavoriteMutation.isPending,
    isRemovingFavorite: removeFavoriteMutation.isPending,
    isFavorite,
  };
};

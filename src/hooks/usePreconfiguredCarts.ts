
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PreconfiguredCart {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  total_price: number | null;
  category: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  created_at: string;
}

// Fonction pour normaliser les items
const normalizeCartItems = (items: any): Array<{ productId: string; quantity: number }> => {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  if (typeof items === 'object') {
    try {
      return Object.values(items).filter(item => 
        item && typeof item === 'object' && item.productId
      );
    } catch (error) {
      console.warn('Erreur lors de la normalisation des items:', error);
      return [];
    }
  }
  return [];
};

export const usePreconfiguredCarts = () => {
  return useQuery({
    queryKey: ['preconfigured-carts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preconfigured_carts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Normaliser les données pour s'assurer que items est toujours un tableau
      return (data || []).map(cart => ({
        ...cart,
        items: normalizeCartItems(cart.items)
      })) as PreconfiguredCart[];
    },
  });
};

export const useCreatePreconfiguredCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (cart: Omit<PreconfiguredCart, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('preconfigured_carts')
        .insert([{
          ...cart,
          items: cart.items || [] // S'assurer qu'items n'est jamais null
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preconfigured-carts'] });
      queryClient.invalidateQueries({ queryKey: ['all-preconfigured-carts'] });
      toast({
        title: "Panier créé",
        description: "Le panier préconfiguré a été créé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le panier préconfiguré",
        variant: "destructive",
      });
      console.error('Error creating preconfigured cart:', error);
    },
  });
};

export const useUpdatePreconfiguredCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...cart }: Partial<PreconfiguredCart> & { id: string }) => {
      const { data, error } = await supabase
        .from('preconfigured_carts')
        .update({
          ...cart,
          items: cart.items || [] // S'assurer qu'items n'est jamais null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preconfigured-carts'] });
      queryClient.invalidateQueries({ queryKey: ['all-preconfigured-carts'] });
      toast({
        title: "Panier modifié",
        description: "Le panier préconfiguré a été modifié avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le panier préconfiguré",
        variant: "destructive",
      });
      console.error('Error updating preconfigured cart:', error);
    },
  });
};

export const useDeletePreconfiguredCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('preconfigured_carts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preconfigured-carts'] });
      queryClient.invalidateQueries({ queryKey: ['all-preconfigured-carts'] });
      toast({
        title: "Panier supprimé",
        description: "Le panier préconfiguré a été supprimé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le panier préconfiguré",
        variant: "destructive",
      });
      console.error('Error deleting preconfigured cart:', error);
    },
  });
};

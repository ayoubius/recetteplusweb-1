
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

export const usePreconfiguredCarts = () => {
  return useQuery({
    queryKey: ['preconfigured-carts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preconfigured_carts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PreconfiguredCart[];
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
        .insert([cart])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preconfigured-carts'] });
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
        .update(cart)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preconfigured-carts'] });
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

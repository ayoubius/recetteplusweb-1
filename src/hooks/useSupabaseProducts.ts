
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface SupabaseProduct {
  id: string;
  name: string;
  image?: string;
  price: number;
  unit: string;
  category: string;
  rating?: number;
  in_stock: boolean;
  promotion?: any;
  created_at: string;
}

export const useSupabaseProducts = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['supabase-products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          throw error;
        }

        return data as SupabaseProduct[];
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les produits.",
          variant: "destructive"
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSupabaseProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<SupabaseProduct, 'id' | 'created_at'>) => {
      const { error } = await supabase
        .from('products')
        .insert([data]);

      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-products'] });
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès."
      });
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le produit.",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateSupabaseProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: string; 
      data: Partial<SupabaseProduct>
    }) => {
      const { error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id);

      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-products'] });
      toast({
        title: "Produit modifié",
        description: "Le produit a été modifié avec succès."
      });
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le produit.",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteSupabaseProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-products'] });
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès."
      });
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit.",
        variant: "destructive"
      });
    }
  });
};

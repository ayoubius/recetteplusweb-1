
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ManageableCategory {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useManageableProductCategories = () => {
  return useQuery({
    queryKey: ['manageableProductCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manageable_product_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as ManageableCategory[];
    },
  });
};

export const useManageableRecipeCategories = () => {
  return useQuery({
    queryKey: ['manageableRecipeCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manageable_recipe_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as ManageableCategory[];
    },
  });
};

export const useCreateProductCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (category: Omit<ManageableCategory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('manageable_product_categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manageableProductCategories'] });
      toast({
        title: "Catégorie créée",
        description: "La catégorie de produit a été créée avec succès"
      });
    },
  });
};

export const useUpdateProductCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...category }: Partial<ManageableCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('manageable_product_categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manageableProductCategories'] });
      toast({
        title: "Catégorie modifiée",
        description: "La catégorie de produit a été modifiée avec succès"
      });
    },
  });
};

export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('manageable_product_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manageableProductCategories'] });
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie de produit a été supprimée avec succès"
      });
    },
  });
};

export const useCreateRecipeCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (category: Omit<ManageableCategory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('manageable_recipe_categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manageableRecipeCategories'] });
      toast({
        title: "Catégorie créée",
        description: "La catégorie de recette a été créée avec succès"
      });
    },
  });
};

export const useUpdateRecipeCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...category }: Partial<ManageableCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('manageable_recipe_categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manageableRecipeCategories'] });
      toast({
        title: "Catégorie modifiée",
        description: "La catégorie de recette a été modifiée avec succès"
      });
    },
  });
};

export const useDeleteRecipeCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('manageable_recipe_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manageableRecipeCategories'] });
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie de recette a été supprimée avec succès"
      });
    },
  });
};

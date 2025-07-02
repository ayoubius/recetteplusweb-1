import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  cook_time: number;
  prep_time: number | null;
  servings: number;
  difficulty: string | null;
  rating: number | null;
  category: string;
  ingredients: any;
  instructions: string[];
  video_id: string | null;
  view_count: number | null;
  created_at: string;
  created_by: string | null;
  profiles?: {
    display_name: string | null;
    email: string | null;
  };
}

export const useSupabaseRecipes = () => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      console.log('Fetching recipes from Supabase...');
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        throw error;
      }

      return data as Recipe[];
    },
  });
};

export const useCreateSupabaseRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (recipe: Omit<Recipe, 'id' | 'created_at'>) => {
      console.log('Creating recipe:', recipe);
      const { data, error } = await supabase
        .from('recipes')
        .insert([recipe])
        .select()
        .single();

      if (error) {
        console.error('Error creating recipe:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export const useUpdateSupabaseRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...recipe }: Partial<Recipe> & { id: string }) => {
      console.log('Updating recipe:', id, recipe);
      const { data, error } = await supabase
        .from('recipes')
        .update(recipe)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating recipe:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export const useDeleteSupabaseRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting recipe:', id);
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting recipe:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

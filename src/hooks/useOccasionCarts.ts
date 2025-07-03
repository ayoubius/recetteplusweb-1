
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOccasionCarts = () => {
  return useQuery({
    queryKey: ['occasion-carts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preconfigured_carts')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .eq('is_occasion', true)
        .order('name');

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useVeganCart = () => {
  return useQuery({
    queryKey: ['vegan-cart'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preconfigured_carts')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .eq('is_occasion', false)
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

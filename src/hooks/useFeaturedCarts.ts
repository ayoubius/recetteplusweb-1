
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFeaturedCarts = () => {
  return useQuery({
    queryKey: ['featured-carts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preconfigured_carts')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook séparé pour les paniers par occasion
export const useFeaturedOccasionCarts = () => {
  return useQuery({
    queryKey: ['featured-occasion-carts'],
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

// Hook pour le panier vegan (non-occasion)
export const useFeaturedVeganCart = () => {
  return useQuery({
    queryKey: ['featured-vegan-cart'],
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


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
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

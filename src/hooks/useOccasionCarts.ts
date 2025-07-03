
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OccasionCart {
  id: string;
  name: string;
  category: string;
  description?: string;
  image?: string;
  items: any[];
  total_price?: number;
  is_active?: boolean;
  is_featured?: boolean;
  created_at: string;
}

export const useOccasionCarts = () => {
  return useQuery({
    queryKey: ['occasion-carts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preconfigured_carts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as OccasionCart[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

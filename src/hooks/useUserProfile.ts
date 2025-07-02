
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useUserProfile = () => {
  const { currentUser } = useAuth();

  return useQuery({
    queryKey: ['user-profile', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }

      return data;
    },
    enabled: !!currentUser?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

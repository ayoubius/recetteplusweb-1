
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAdminSupabase } from '@/hooks/useAdminSupabase';

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at?: string;
  created_at: string;
  updated_at: string;
  user_metadata?: any;
  app_metadata?: any;
}

export const useSupabaseAuthUsers = () => {
  const { toast } = useToast();
  const supabaseAdmin = useAdminSupabase();

  return useQuery({
    queryKey: ['supabase-auth-users'],
    queryFn: async () => {
      try {
        console.log('Fetching auth users with admin client...');
        const { data, error } = await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 1000
        });

        if (error) {
          console.error('Error fetching auth users:', error);
          throw error;
        }

        console.log('Auth users fetched successfully:', data.users?.length);
        return data.users as AuthUser[];
      } catch (error) {
        console.error('Error fetching auth users:', error);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de récupérer les utilisateurs d'authentification.",
          variant: "destructive"
        });
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: 2
  });
};

export const useDeleteSupabaseAuthUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const supabaseAdmin = useAdminSupabase();

  return useMutation({
    mutationFn: async (userId: string) => {
      console.log('Deleting auth user:', userId);
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (error) {
        console.error('Error deleting auth user:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-auth-users'] });
      queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
        variant: "destructive"
      });
    },
    onError: (error) => {
      console.error('Error deleting auth user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
        variant: "destructive"
      });
    }
  });
};

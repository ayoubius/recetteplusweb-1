
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminPermissions {
  id: string;
  user_id: string;
  can_manage_users: boolean;
  can_manage_products: boolean;
  can_manage_recipes: boolean;
  can_manage_videos: boolean;
  can_manage_categories: boolean;
  can_manage_orders: boolean;
  can_validate_orders: boolean;
  can_manage_deliveries: boolean;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
}

export const useAdminPermissions = () => {
  return useQuery({
    queryKey: ['adminPermissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AdminPermissions[];
    },
  });
};

export const useCurrentUserPermissions = () => {
  return useQuery({
    queryKey: ['currentUserPermissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (error) throw error;
      return data as AdminPermissions | null;
    },
  });
};

export const useCreateAdminPermissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (permissions: Omit<AdminPermissions, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('admin_permissions')
        .insert([permissions])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPermissions'] });
      toast({
        title: "Permissions créées",
        description: "Les permissions admin ont été créées avec succès"
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer les permissions",
        variant: "destructive"
      });
    },
  });
};

export const useUpdateAdminPermissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...permissions }: Partial<AdminPermissions> & { id: string }) => {
      const { data, error } = await supabase
        .from('admin_permissions')
        .update(permissions)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPermissions'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserPermissions'] });
      toast({
        title: "Permissions modifiées",
        description: "Les permissions admin ont été modifiées avec succès"
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier les permissions",
        variant: "destructive"
      });
    },
  });
};

export const useDeleteAdminPermissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('admin_permissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPermissions'] });
      toast({
        title: "Permissions supprimées",
        description: "Les permissions admin ont été supprimées avec succès"
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les permissions",
        variant: "destructive"
      });
    },
  });
};

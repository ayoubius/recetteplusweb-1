
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description?: string;
  photo_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      return data as TeamMember[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminTeamMembers = () => {
  return useQuery({
    queryKey: ['admin-team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order');

      if (error) throw error;
      return data as TeamMember[];
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase
        .from('team_members')
        .insert(data);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      toast({
        title: "Membre ajouté",
        description: "Le membre de l'équipe a été ajouté avec succès."
      });
    },
    onError: (error) => {
      console.error('Erreur création membre:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le membre de l'équipe.",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<TeamMember>) => {
      const { error } = await supabase
        .from('team_members')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      toast({
        title: "Membre modifié",
        description: "Le membre de l'équipe a été modifié avec succès."
      });
    },
    onError: (error) => {
      console.error('Erreur modification membre:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le membre de l'équipe.",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      toast({
        title: "Membre supprimé",
        description: "Le membre de l'équipe a été supprimé avec succès.",
        variant: "destructive"
      });
    },
    onError: (error) => {
      console.error('Erreur suppression membre:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre de l'équipe.",
        variant: "destructive"
      });
    }
  });
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NewsletterCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  sent_at?: string;
  sent_count?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useNewsletterCampaigns = () => {
  return useQuery({
    queryKey: ['newsletter-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as NewsletterCampaign[];
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useSendNewsletter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { title: string; subject: string; content: string }) => {
      const { data: result, error } = await supabase.functions.invoke('send-newsletter', {
        body: data
      });

      if (error) throw error;
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-campaigns'] });
      toast({
        title: "Newsletter envoyée",
        description: result.message || "La newsletter a été envoyée avec succès."
      });
    },
    onError: (error) => {
      console.error('Erreur envoi newsletter:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la newsletter.",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateUserNewsletterPreference = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, enabled }: { userId: string; enabled: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: {
            newsletter_enabled: enabled,
            dietaryRestrictions: [],
            favoriteCategories: []
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Préférences mises à jour",
        description: `Newsletter ${variables.enabled ? 'activée' : 'désactivée'} avec succès.`
      });
    },
    onError: (error) => {
      console.error('Erreur mise à jour préférences:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences.",
        variant: "destructive"
      });
    }
  });
};

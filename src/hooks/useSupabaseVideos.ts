
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Video {
  id: string;
  title: string;
  description?: string;
  video_url?: string;
  thumbnail?: string;
  category: string;
  duration?: string;
  views?: number;
  likes?: number;
  recipe_id?: string;
  created_at: string;
  recipes?: {
    title: string;
  };
}

export const useSupabaseVideos = () => {
  return useQuery({
    queryKey: ['supabase-videos'],
    queryFn: async () => {
      console.log('Fetching videos from Supabase...');
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          recipes(title)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        throw error;
      }

      console.log('Videos fetched successfully:', data?.length);
      return data as Video[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSupabaseVideo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (video: Omit<Video, 'id' | 'created_at' | 'views' | 'likes'>) => {
      const { data, error } = await supabase
        .from('videos')
        .insert([video])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-videos'] });
      toast({
        title: "Vidéo créée",
        description: "La vidéo a été créée avec succès",
      });
    },
    onError: (error) => {
      console.error('Error creating video:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la vidéo",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSupabaseVideo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...video }: Partial<Video> & { id: string }) => {
      const { data, error } = await supabase
        .from('videos')
        .update(video)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-videos'] });
      toast({
        title: "Vidéo modifiée",
        description: "La vidéo a été modifiée avec succès",
      });
    },
    onError: (error) => {
      console.error('Error updating video:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la vidéo",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSupabaseVideo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-videos'] });
      toast({
        title: "Vidéo supprimée",
        description: "La vidéo a été supprimée avec succès",
        variant: "destructive",
      });
    },
    onError: (error) => {
      console.error('Error deleting video:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la vidéo",
        variant: "destructive",
      });
    },
  });
};

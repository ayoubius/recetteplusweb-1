
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { videoService, VideoData, VideoFilters } from '@/lib/videoService';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedVideos = (filters?: VideoFilters) => {
  return useQuery({
    queryKey: ['enhanced-videos', filters],
    queryFn: () => filters ? videoService.getFiltered(filters) : videoService.getAll(),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useVideosByUser = (userId: string) => {
  return useQuery({
    queryKey: ['videos-by-user', userId],
    queryFn: () => videoService.getByUser(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateVideo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: VideoData) => videoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-videos'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast({
        title: "Vidéo créée",
        description: "La vidéo a été créée avec succès"
      });
    },
    onError: (error) => {
      console.error('Error creating video:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la vidéo",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VideoData> }) => 
      videoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-videos'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast({
        title: "Vidéo modifiée",
        description: "La vidéo a été modifiée avec succès"
      });
    },
    onError: (error) => {
      console.error('Error updating video:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la vidéo",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => videoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-videos'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast({
        title: "Vidéo supprimée",
        description: "La vidéo a été supprimée avec succès"
      });
    },
    onError: (error) => {
      console.error('Error deleting video:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la vidéo",
        variant: "destructive"
      });
    }
  });
};

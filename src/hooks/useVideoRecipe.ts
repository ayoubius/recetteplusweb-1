
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useVideoRecipe = (videoId: string) => {
  return useQuery({
    queryKey: ['video-recipe', videoId],
    queryFn: async () => {
      const { data: video } = await supabase
        .from('videos')
        .select('recipe_id')
        .eq('id', videoId)
        .single();

      if (!video?.recipe_id) return null;

      const { data: recipe } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', video.recipe_id)
        .single();

      return recipe;
    },
    enabled: !!videoId,
  });
};


import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useVideoRecipe = (videoId: string) => {
  return useQuery({
    queryKey: ['video-recipe', videoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          recipe_id,
          recipes (
            id,
            title,
            description,
            image,
            cook_time,
            prep_time,
            servings,
            difficulty,
            rating,
            category,
            ingredients,
            instructions
          )
        `)
        .eq('id', videoId)
        .single();

      if (error) throw error;
      return data?.recipes || null;
    },
    enabled: !!videoId,
  });
};

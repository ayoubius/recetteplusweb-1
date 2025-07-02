
// Hook de compatibilité pour l'ancien système Firebase
import { useSupabaseVideos } from './useSupabaseVideos';

export const useVideos = () => {
  return useSupabaseVideos();
};

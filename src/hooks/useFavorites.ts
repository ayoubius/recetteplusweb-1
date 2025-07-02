
// Hook de compatibilité pour l'ancien système Firebase
import { useSupabaseFavorites } from './useSupabaseFavorites';

export const useFavorites = () => {
  return useSupabaseFavorites();
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useSupabaseFavorites } from '@/hooks/useSupabaseFavorites';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  itemId: string;
  type: 'recipe' | 'product' | 'video';
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  itemId, 
  type, 
  className,
  size = 'icon',
  variant = 'ghost'
}) => {
  const { currentUser } = useAuth();
  const { isFavorite, addFavorite, removeFavorite, isAddingFavorite, isRemovingFavorite } = useSupabaseFavorites();

  if (!currentUser) return null;

  const isFav = isFavorite(itemId, type);
  const isLoading = isAddingFavorite || isRemovingFavorite;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFav) {
      removeFavorite({ itemId, type });
    } else {
      addFavorite({ itemId, type });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-colors",
          isFav ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
        )} 
      />
    </Button>
  );
};

export default FavoriteButton;

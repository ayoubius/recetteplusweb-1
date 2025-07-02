
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { formatCFA } from '@/lib/currency';
import { usePersonalCart } from '@/hooks/useSupabaseCart';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from '@/components/FavoriteButton';
import QuantityModal from '@/components/QuantityModal';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  category: string;
  rating: number;
  inStock: boolean;
  promotion?: {
    discount: number;
    originalPrice: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  unit,
  category,
  rating,
  inStock,
  promotion
}) => {
  const { addToPersonalCart, isAdding } = usePersonalCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);

  const handleAddToCart = (quantity: number) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    addToPersonalCart({ productId: id, quantity });
  };

  const handleCardClick = () => {
    navigate(`/produits/${id}`);
  };

  const handleAddButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setIsQuantityModalOpen(true);
  };

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 food-shadow cursor-pointer">
        <div className="relative overflow-hidden" onClick={handleCardClick}>
          <img 
            src={image} 
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <FavoriteButton
            itemId={id}
            type="product"
            className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-sm"
          />
          
          {promotion && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-red-500 text-white">
                -{promotion.discount}%
              </Badge>
            </div>
          )}
          
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-white">
                Rupture de stock
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4" onClick={handleCardClick}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-orange-500 transition-colors">
                {name}
              </h3>
              <Badge variant="outline" className="text-xs mb-2">
                {category}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
            <span className="text-sm text-gray-500">par {unit}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {promotion ? (
                <>
                  <span className="text-lg font-bold text-orange-500">
                    {formatCFA(price)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatCFA(promotion.originalPrice)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-orange-500">
                  {formatCFA(price)}
                </span>
              )}
            </div>
            
            <Button 
              onClick={handleAddButtonClick}
              disabled={!inStock || isAdding}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isAdding ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Ajouter
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <QuantityModal
        isOpen={isQuantityModalOpen}
        onClose={() => setIsQuantityModalOpen(false)}
        onConfirm={handleAddToCart}
        productName={name}
        isLoading={isAdding}
      />
    </>
  );
};

export default ProductCard;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { formatCFA } from '@/lib/currency';
import { useFeaturedCarts } from '@/hooks/useFeaturedCarts';
import { useNavigate } from 'react-router-dom';

const FeaturedCartsCarousel = () => {
  const { data: featuredCarts = [], isLoading } = useFeaturedCarts();
  const navigate = useNavigate();

  if (isLoading || featuredCarts.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Paniers en Vedette</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate('/paniers-preconfigures')}
          className="text-orange-500 border-orange-500 hover:bg-orange-50"
        >
          Voir tous <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 animate-scroll" style={{ width: 'max-content' }}>
          {featuredCarts.map((cart) => (
            <Card key={cart.id} className="w-72 flex-shrink-0 hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={cart.image || '/placeholder.svg'} 
                  alt={cart.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-2 left-2 bg-orange-500">
                  En vedette
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                  {cart.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {cart.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-orange-500">
                    {formatCFA(cart.total_price || 0)}
                  </span>
                  <Badge variant="outline">
                    {cart.category}
                  </Badge>
                </div>
                
                <Button 
                  onClick={() => navigate(`/paniers-preconfigures/${cart.id}`)}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Voir le panier
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCartsCarousel;

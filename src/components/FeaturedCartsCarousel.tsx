
import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFeaturedCarts } from '@/hooks/useFeaturedCarts';
import { formatCFA } from '@/lib/currency';
import { Link } from 'react-router-dom';

const FeaturedCartsCarousel = () => {
  const { data: carts = [], isLoading } = useFeaturedCarts();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Paniers en Vedette</h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map(i => (
            <Card key={i} className="flex-shrink-0 w-72 animate-pulse">
              <div className="h-32 bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (carts.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Paniers en Vedette</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Link to="/paniers-preconfigures">
            <Button variant="outline" className="ml-2">
              Voir tous les paniers
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {carts.map((cart) => (
          <Card key={cart.id} className="flex-shrink-0 w-72 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="relative h-32 overflow-hidden">
              <img 
                src={cart.image || '/placeholder.svg'} 
                alt={cart.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2">
                <Badge className="bg-orange-500 text-white">
                  En vedette
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-orange-500 transition-colors">
                  {cart.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {cart.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-orange-500">
                    {formatCFA(cart.total_price || 0)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {cart.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCartsCarousel;

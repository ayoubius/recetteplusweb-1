
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Heart, Star, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOccasionCarts } from '@/hooks/useOccasionCarts';
import { useFeaturedVeganCart } from '@/hooks/useFeaturedCarts';
import { usePreconfiguredCarts } from '@/hooks/useSupabaseCart';
import { formatCFA } from '@/lib/currency';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';

const FeaturedCartsSection = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { data: occasionCarts = [] } = useOccasionCarts();
  const { data: veganCart } = useFeaturedVeganCart();
  const { addPreconfiguredCartToPersonal, isAdding } = usePreconfiguredCarts();

  const handleAddToCart = (cartId: string, cartName: string) => {
    if (!currentUser) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits au panier",
        variant: "destructive"
      });
      return;
    }

    addPreconfiguredCartToPersonal(cartId);
  };

  return (
    <div className="space-y-8">
      {/* Section Panier Vegan - Style moderne et compact */}
      {veganCart && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Leaf className="h-5 w-5 text-green-500 mr-2" />
              Sélection Vegan
            </h2>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-shrink-0">
                <img 
                  src={veganCart.image || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120'} 
                  alt={veganCart.name}
                  className="w-16 h-12 rounded-lg object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">
                        {veganCart.name}
                      </h3>
                      <Badge className="bg-green-500 text-white text-xs">
                        <Leaf className="h-3 w-3 mr-1" />
                        Vegan
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {veganCart.description}
                    </p>
                    <div className="text-xl font-bold text-green-600">
                      {formatCFA(veganCart.total_price || 0)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button 
                      onClick={() => handleAddToCart(veganCart.id, veganCart.name)}
                      disabled={!currentUser || isAdding}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {isAdding ? 'Ajout...' : 'Ajouter'}
                    </Button>
                    
                    <Link to={`/paniers-preconfigures/${veganCart.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Détails
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Paniers par Occasion */}
      {occasionCarts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Star className="h-6 w-6 text-orange-500 mr-2" />
              Paniers par Occasion
            </h2>
            <Link to="/paniers-preconfigures">
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {occasionCarts.map((cart) => (
              <Card key={cart.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative overflow-hidden">
                  <img 
                    src={cart.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'} 
                    alt={cart.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-orange-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Occasion
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">
                      {cart.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {cart.description}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-xl font-bold text-orange-600 text-center">
                      {formatCFA(cart.total_price || 0)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleAddToCart(cart.id, cart.name)}
                      disabled={!currentUser || isAdding}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isAdding ? 'Ajout...' : 'Ajouter'}
                    </Button>
                    
                    <Link to={`/paniers-preconfigures/${cart.id}`}>
                      <Button variant="outline" className="w-full" size="sm">
                        Détails
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedCartsSection;

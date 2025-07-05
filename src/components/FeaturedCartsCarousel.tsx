import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFeaturedOccasionCarts, useFeaturedVeganCart } from '@/hooks/useFeaturedCarts';
import { usePreconfiguredCarts } from '@/hooks/useSupabaseCart';
import { formatCFA } from '@/lib/currency';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
const FeaturedCartsCarousel = () => {
  const {
    currentUser
  } = useAuth();
  const {
    toast
  } = useToast();
  const {
    data: occasionCarts = []
  } = useFeaturedOccasionCarts();
  const {
    data: veganCart
  } = useFeaturedVeganCart();
  const {
    addPreconfiguredCartToPersonal,
    isAdding
  } = usePreconfiguredCarts();
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
  return <div className="space-y-12">
      {/* Section Panier Vegan */}
      {veganCart && <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Heart className="h-8 w-8 text-green-500 mr-3" />
              Panier Vegan
            </h2>
            <Link to="/paniers-preconfigures">
              <Button variant="outline" className="flex items-center">
                Voir plus
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <Card className="hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
            <div className="md:flex flex gap-2">
              <div className="md:w-1/2 relative overflow-hidden">
                <img src={veganCart.image || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500'} alt={veganCart.name} className="w-full h-64 md:h-full hover:scale-110 transition-transform duration-700 h-10 object-cover" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-500 text-white text-sm px-3 py-1">
                    <Heart className="h-4 w-4 mr-1" />
                    100% Vegan
                  </Badge>
                </div>
              </div>
              
              <div className="md:w-1/2 p-8 h-20">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                      {veganCart.name}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {veganCart.description}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-green-600 text-center">
                      {formatCFA(veganCart.total_price || 0)}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button onClick={() => handleAddToCart(veganCart.id, veganCart.name)} disabled={!currentUser || isAdding} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 text-lg">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {isAdding ? 'Ajout...' : 'Ajouter au panier'}
                      </Button>
                      
                      <Link to={`/paniers-preconfigures/${veganCart.id}`} className="flex-1">
                        <Button variant="outline" className="w-full py-3 text-lg">
                          Détails
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>}

      {/* Section Paniers par Occasion */}
      {occasionCarts.length > 0 && <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Star className="h-8 w-8 text-orange-500 mr-3" />
              Paniers par Occasion
            </h2>
            <Link to="/paniers-preconfigures">
              <Button variant="outline" className="flex items-center">
                Voir tous
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {occasionCarts.slice(0, 3).map(cart => <Card key={cart.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img src={cart.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'} alt={cart.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-orange-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Occasion Spéciale
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-orange-500 transition-colors">
                      {cart.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {cart.description}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-orange-600 text-center">
                      {formatCFA(cart.total_price || 0)}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button onClick={() => handleAddToCart(cart.id, cart.name)} disabled={!currentUser || isAdding} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isAdding ? 'Ajout...' : 'Ajouter au panier'}
                    </Button>
                    
                    <Link to={`/paniers-preconfigures/${cart.id}`}>
                      <Button variant="outline" className="w-full">
                        Voir les détails
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </section>}
    </div>;
};
export default FeaturedCartsCarousel;
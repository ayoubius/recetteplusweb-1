
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Star, Heart, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePreconfiguredCarts } from '@/hooks/useSupabaseCart';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/currency';
import { Input } from '@/components/ui/input';

const PreconfiguredCarts = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { addPreconfiguredCartToPersonal, isAdding } = usePreconfiguredCarts();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Récupérer tous les paniers préconfigurés
  const { data: allCarts = [], isLoading } = useQuery({
    queryKey: ['all-preconfigured-carts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preconfigured_carts')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });

  const categories = ['Tous', ...Array.from(new Set(allCarts.map(cart => cart.category).filter(Boolean)))];

  const filteredCarts = allCarts.filter(cart => {
    const matchesCategory = selectedCategory === 'Tous' || cart.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      cart.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const featuredCarts = filteredCarts.filter(cart => cart.is_featured);
  const regularCarts = filteredCarts.filter(cart => !cart.is_featured);

  const handleAddCartToPersonal = async (cartId: string, cartName: string) => {
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

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Package className="h-10 w-10 mr-3 text-orange-500" />
            Paniers Préconfigurés
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos sélections de produits soigneusement choisies pour différents besoins et occasions
          </p>
        </div>

        {/* Section de recherche et filtres */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un panier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filtrer par :</span>
            </div>
          </div>

          {/* Filtres par catégorie */}
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-xl shadow-sm">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  onClick={() => setSelectedCategory(category)}
                  className={`transition-all ${
                    selectedCategory === category 
                      ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md" 
                      : "hover:bg-orange-50 text-gray-700"
                  }`}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Paniers en vedette */}
        {featuredCarts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Star className="h-6 w-6 mr-2 text-yellow-500" />
                Paniers en vedette
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollLeft}
                  className="rounded-full border-orange-200 hover:bg-orange-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollRight}
                  className="rounded-full border-orange-200 hover:bg-orange-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            >
              {featuredCarts.map((cart) => (
                <Card 
                  key={cart.id} 
                  className="flex-shrink-0 w-80 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group border-0 shadow-lg"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={cart.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'} 
                      alt={cart.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        En vedette
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="bg-white/90 text-gray-700">
                        {cart.category}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-xl mb-2 group-hover:text-orange-500 transition-colors">
                        {cart.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {cart.description}
                      </p>
                    </div>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-center text-orange-500">
                        {formatPrice(cart.total_price || 0)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleAddCartToPersonal(cart.id, cart.name)}
                        disabled={!currentUser || isAdding}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isAdding ? 'Ajout...' : 'Ajouter au panier'}
                      </Button>
                      
                      <Link to={`/paniers/${cart.id}`}>
                        <Button variant="outline" className="w-full group">
                          Voir les détails
                          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tous les paniers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Package className="h-6 w-6 mr-2 text-orange-500" />
            {selectedCategory === 'Tous' ? 'Tous nos paniers' : `Paniers - ${selectedCategory}`}
            <Badge variant="outline" className="ml-3">
              {filteredCarts.length} panier{filteredCarts.length > 1 ? 's' : ''}
            </Badge>
          </h2>

          {filteredCarts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Aucun panier trouvé
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? `Aucun panier ne correspond à "${searchTerm}"`
                  : "Aucun panier ne correspond à ces critères pour le moment."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCarts.map((cart) => (
                <Card 
                  key={cart.id} 
                  className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group border-0 shadow-md"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={cart.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'} 
                      alt={cart.name}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {cart.is_featured && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-yellow-500 text-white text-xs">
                          <Star className="h-2 w-2 mr-1" />
                          Vedette
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-white/90 text-xs">
                        {cart.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-orange-500 transition-colors line-clamp-1">
                        {cart.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {cart.description}
                      </p>
                    </div>

                    <div className="mb-3">
                      <div className="text-xl font-bold text-center text-orange-500">
                        {formatPrice(cart.total_price || 0)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleAddCartToPersonal(cart.id, cart.name)}
                        disabled={!currentUser || isAdding}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        size="sm"
                      >
                        <ShoppingCart className="h-3 w-3 mr-2" />
                        {isAdding ? 'Ajout...' : 'Ajouter'}
                      </Button>
                      
                      <Link to={`/paniers/${cart.id}`}>
                        <Button variant="outline" className="w-full" size="sm">
                          Détails
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Message de connexion */}
        {!currentUser && (
          <div className="mt-8 text-center">
            <Card className="max-w-md mx-auto border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <Heart className="h-12 w-12 mx-auto text-orange-500 mb-2" />
                  <p className="text-gray-600 mb-4">
                    Connectez-vous pour ajouter des paniers à votre panier personnalisé
                  </p>
                </div>
                <Link to="/login">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Se connecter
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreconfiguredCarts;


import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Users, ArrowRight, ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePreconfiguredCarts } from '@/hooks/useSupabaseCart';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/currency';

const PreconfiguredCarts = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { addPreconfiguredCartToPersonal, isAdding } = usePreconfiguredCarts();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedType, setSelectedType] = useState<string>('Tous');
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
  const types = ['Tous', 'Par Occasion', 'Autres'];

  const filteredCarts = allCarts.filter(cart => {
    const matchesCategory = selectedCategory === 'Tous' || cart.category === selectedCategory;
    const matchesType = selectedType === 'Tous' || 
      (selectedType === 'Par Occasion' && (cart as any).is_occasion) ||
      (selectedType === 'Autres' && !(cart as any).is_occasion);
    
    return matchesCategory && matchesType;
  });

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
    <div className="min-h-screen bg-gray-50">
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

        {/* Filtres */}
        <div className="space-y-4 mb-8">
          {/* Filtres par type */}
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-lg shadow-sm">
              {types.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "ghost"}
                  onClick={() => setSelectedType(type)}
                  className={`transition-all ${selectedType === type ? "bg-orange-500 hover:bg-orange-600 text-white" : "hover:bg-orange-50"}`}
                  size="sm"
                >
                  {type === 'Par Occasion' && <Star className="h-4 w-4 mr-1" />}
                  {type === 'Autres' && <Heart className="h-4 w-4 mr-1" />}
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Filtres par catégorie */}
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-lg shadow-sm">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  onClick={() => setSelectedCategory(category)}
                  className={`transition-all ${selectedCategory === category ? "bg-blue-500 hover:bg-blue-600 text-white" : "hover:bg-blue-50"}`}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Section défilement horizontal */}
        <div className="relative mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'Tous' && selectedType === 'Tous' ? 'Tous nos paniers' : 
               `Paniers ${selectedType !== 'Tous' ? selectedType : ''} ${selectedCategory !== 'Tous' ? `- ${selectedCategory}` : ''}`.trim()}
            </h2>
            <div className="flex gap-2">
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
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none' 
            }}
          >
            {filteredCarts.map((cart) => (
              <Card 
                key={cart.id} 
                className="flex-shrink-0 w-80 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={cart.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'} 
                    alt={cart.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {(cart as any).is_occasion ? (
                      <Badge className="bg-orange-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Occasion
                      </Badge>
                    ) : (
                      <Badge className="bg-green-500 text-white">
                        <Heart className="h-3 w-3 mr-1" />
                        Quotidien
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="bg-white/90">
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
                    <div className={`text-2xl font-bold text-center ${(cart as any).is_occasion ? 'text-orange-500' : 'text-green-500'}`}>
                      {formatPrice(cart.total_price || 0)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleAddCartToPersonal(cart.id, cart.name)}
                      disabled={!currentUser || isAdding}
                      className={`w-full text-white ${(cart as any).is_occasion ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isAdding ? 'Ajout...' : 'Ajouter au panier'}
                    </Button>
                    
                    <Link to={`/paniers-preconfigures/${cart.id}`}>
                      <Button variant="outline" className="w-full group">
                        <ArrowRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        Voir les détails
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredCarts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Aucun panier trouvé
            </h3>
            <p className="text-gray-500">
              Aucun panier ne correspond à ces critères pour le moment.
            </p>
          </div>
        )}

        {/* Message de connexion */}
        {!currentUser && (
          <div className="mt-8 text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  Connectez-vous pour ajouter des paniers à votre panier personnalisé
                </p>
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

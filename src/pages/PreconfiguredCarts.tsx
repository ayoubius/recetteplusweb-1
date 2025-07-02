
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/currency';

interface PreconfiguredCart {
  id: string;
  name: string;
  description: string;
  image: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  totalPrice: number;
  estimatedServings: number;
  category: string;
}

// Données d'exemple pour les paniers préconfigurés
const preconfiguredCarts: PreconfiguredCart[] = [
  {
    id: '1',
    name: 'Panier Famille Premium',
    description: 'Tout le nécessaire pour une semaine de repas équilibrés pour une famille de 4 personnes',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    items: [
      { productId: '1', quantity: 2 },
      { productId: '2', quantity: 3 },
      { productId: '3', quantity: 1 },
    ],
    totalPrice: 25000,
    estimatedServings: 28,
    category: 'Famille'
  },
  {
    id: '2',
    name: 'Panier Solo Healthy',
    description: 'Sélection de produits sains pour une personne active pendant une semaine',
    image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=500',
    items: [
      { productId: '4', quantity: 1 },
      { productId: '5', quantity: 2 },
    ],
    totalPrice: 12000,
    estimatedServings: 7,
    category: 'Solo'
  },
  {
    id: '3',
    name: 'Panier Végétarien',
    description: 'Une sélection de légumes frais et de protéines végétales pour 2 personnes',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
    items: [
      { productId: '6', quantity: 3 },
      { productId: '7', quantity: 2 },
    ],
    totalPrice: 18000,
    estimatedServings: 14,
    category: 'Végétarien'
  },
  {
    id: '4',
    name: 'Panier Express',
    description: 'Produits prêts à cuisiner pour des repas rapides et savoureux',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d25a?w=500',
    items: [
      { productId: '8', quantity: 4 },
      { productId: '9', quantity: 1 },
    ],
    totalPrice: 15000,
    estimatedServings: 12,
    category: 'Express'
  },
  {
    id: '5',
    name: 'Panier Traditionnel',
    description: 'Ingrédients authentiques pour préparer des plats traditionnels maliens',
    image: 'https://images.unsplash.com/photo-1574653853027-5d3b24829dd2?w=500',
    items: [
      { productId: '10', quantity: 2 },
      { productId: '11', quantity: 3 },
    ],
    totalPrice: 22000,
    estimatedServings: 20,
    category: 'Traditionnel'
  },
];

const PreconfiguredCarts = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = ['Tous', 'Famille', 'Solo', 'Végétarien', 'Express', 'Traditionnel'];

  const filteredCarts = selectedCategory === 'Tous' 
    ? preconfiguredCarts 
    : preconfiguredCarts.filter(cart => cart.category === selectedCategory);

  const handleAddCartToCustomCart = async (cart: PreconfiguredCart) => {
    if (!currentUser) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits au panier",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Panier ajouté",
        description: `Le panier "${cart.name}" a été ajouté à votre panier personnalisé`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le panier",
        variant: "destructive"
      });
    }
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

        {/* Filtres par catégorie */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-lg shadow-sm">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                onClick={() => setSelectedCategory(category)}
                className={`transition-all ${selectedCategory === category ? "bg-orange-500 hover:bg-orange-600 text-white" : "hover:bg-orange-50"}`}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Section défilement horizontal */}
        <div className="relative mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'Tous' ? 'Tous nos paniers' : `Paniers ${selectedCategory}`}
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
                    src={cart.image} 
                    alt={cart.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-orange-500 text-white">
                      {cart.items.length} produits
                    </Badge>
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
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{cart.estimatedServings} portions</span>
                    </div>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      <span>{cart.items.length} articles</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-orange-500 text-center">
                      {formatPrice(cart.totalPrice)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleAddCartToCustomCart(cart)}
                      disabled={!currentUser}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Ajouter au panier
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
              Aucun panier ne correspond à cette catégorie pour le moment.
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

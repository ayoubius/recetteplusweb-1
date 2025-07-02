
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Package, Users, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';

interface PreconfiguredCartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

interface PreconfiguredCartDetail {
  id: string;
  name: string;
  description: string;
  image: string;
  items: PreconfiguredCartItem[];
  totalPrice: number;
  estimatedServings: number;
  category: string;
}

// Données d'exemple
const mockCartDetail: PreconfiguredCartDetail = {
  id: '1',
  name: 'Panier Famille Premium',
  description: 'Un assortiment complet pour une famille de 4 personnes avec des produits de qualité premium pour une semaine entière.',
  image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
  items: [
    { productId: '1', quantity: 2, name: 'Riz Jasmin Premium', price: 3500 },
    { productId: '2', quantity: 1, name: 'Huile de Palme Bio', price: 2000 },
    { productId: '3', quantity: 3, name: 'Tomates fraîches', price: 1500 },
    { productId: '4', quantity: 2, name: 'Oignons', price: 1000 },
    { productId: '5', quantity: 1, name: 'Poisson frais', price: 8000 },
  ],
  totalPrice: 25000,
  estimatedServings: 28,
  category: 'Famille'
};

const PreconfiguredCartDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // En production, vous récupéreriez les données depuis l'API
  const cartDetail = mockCartDetail;

  const handleAddToCart = () => {
    if (!currentUser) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter ce panier",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Panier ajouté",
      description: `Le panier "${cartDetail.name}" a été ajouté à votre panier`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/paniers-preconfigures">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux paniers
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image et informations principales */}
          <div>
            <div className="relative mb-6">
              <img 
                src={cartDetail.image} 
                alt={cartDetail.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-orange-500 text-white">
                  {cartDetail.items.length} produits
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-white/90">
                  {cartDetail.category}
                </Badge>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Détails du panier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-gray-400" />
                    <span>Portions estimées</span>
                  </div>
                  <span className="font-semibold">{cartDetail.estimatedServings}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-gray-400" />
                    <span>Nombre de produits</span>
                  </div>
                  <span className="font-semibold">{cartDetail.items.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-400" />
                    <span>Durée estimée</span>
                  </div>
                  <span className="font-semibold">7 jours</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations et commande */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {cartDetail.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {cartDetail.description}
              </p>
            </div>

            {/* Prix et commande */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-orange-500 mb-2">
                    {formatPrice(cartDetail.totalPrice)}
                  </div>
                  <p className="text-gray-600">Prix total du panier</p>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ajouter au panier
                </Button>
              </CardContent>
            </Card>

            {/* Liste des produits */}
            <Card>
              <CardHeader>
                <CardTitle>Contenu du panier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartDetail.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-orange-500">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatPrice(item.price)} / unité
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreconfiguredCartDetail;

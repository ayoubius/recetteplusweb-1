
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Package, 
  ChefHat, 
  Heart,
  Settings,
  CreditCard,
  Truck
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useMainCart } from '@/hooks/useSupabaseCart';
import MainCartView from '@/components/cart/MainCartView';
import PersonalCartView from '@/components/cart/PersonalCartView';
import RecipeCartsView from '@/components/cart/RecipeCartsView';
import PreconfiguredCartsView from '@/components/cart/PreconfiguredCartsView';

const Cart = () => {
  const { currentUser } = useAuth();
  const { cartItems, isLoading } = useMainCart();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <ShoppingCart className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-gray-900">Connexion requise</CardTitle>
            <CardDescription>
              Vous devez être connecté pour voir votre panier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/login">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Se connecter
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <ShoppingCart className="h-12 w-12 text-orange-500 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Mon Panier
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tous vos paniers sont automatiquement combinés pour votre commande
          </p>
        </div>

        {/* Cart Tabs */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <Tabs defaultValue="main" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="main" className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Principal</span>
                  <Badge variant="secondary" className="ml-1">
                    {cartItems?.length || 0}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="personal" className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Personnel</span>
                </TabsTrigger>
                <TabsTrigger value="recipes" className="flex items-center space-x-2">
                  <ChefHat className="h-4 w-4" />
                  <span className="hidden sm:inline">Recettes</span>
                </TabsTrigger>
                <TabsTrigger value="preconfigured" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Préconfigurés</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="main" className="mt-6">
                <MainCartView />
              </TabsContent>

              <TabsContent value="personal" className="mt-6">
                <PersonalCartView />
              </TabsContent>

              <TabsContent value="recipes" className="mt-6">
                <RecipeCartsView />
              </TabsContent>

              <TabsContent value="preconfigured" className="mt-6">
                <PreconfiguredCartsView />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Package className="h-12 w-12 text-orange-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Continuer les achats</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/produits">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  Voir les produits
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <ChefHat className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Paniers préconfigurés</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/paniers-preconfigures">
                <Button variant="outline" className="w-full hover:bg-green-50 border-green-200">
                  Découvrir
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CreditCard className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Paiement rapide</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full hover:bg-blue-50 border-blue-200">
                Configurer
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Truck className="h-12 w-12 text-purple-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Suivi commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/historique-commandes">
                <Button variant="outline" className="w-full hover:bg-purple-50 border-purple-200">
                  Voir l'historique
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Package, ChefHat, User, Settings } from 'lucide-react';
import { useMainCart } from '@/hooks/useSupabaseCart';
import { formatCFA, DELIVERY_FEE } from '@/lib/currency';
import { useNavigate } from 'react-router-dom';
import { MainCartItem } from '@/types/cart';
import SimpleOrderForm from './SimpleOrderForm';

const MainCartView = () => {
  const { cartItems, isLoading } = useMainCart();
  const navigate = useNavigate();
  const [showOrderForm, setShowOrderForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Grouper les items par type de panier
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.cart_type]) {
      acc[item.cart_type] = [];
    }
    acc[item.cart_type].push(item);
    return acc;
  }, {} as Record<string, MainCartItem[]>);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.total_price || 0), 0);

  const handleOrderComplete = () => {
    setShowOrderForm(false);
    navigate('/profile');
  };

  const getCartIcon = (cartType: string) => {
    switch (cartType) {
      case 'personal':
        return <User className="h-5 w-5" />;
      case 'recipe':
        return <ChefHat className="h-5 w-5" />;
      case 'preconfigured':
        return <Settings className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getCartTypeLabel = (cartType: string) => {
    switch (cartType) {
      case 'personal':
        return 'Personnel';
      case 'recipe':
        return 'Recette';
      case 'preconfigured':
        return 'Préconfiguré';
      default:
        return 'Autre';
    }
  };

  if (showOrderForm) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setShowOrderForm(false)}
          className="mb-4"
        >
          ← Retour au panier
        </Button>
        <SimpleOrderForm
          cartItems={cartItems}
          subtotal={subtotal}
          onOrderComplete={handleOrderComplete}
        />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="pt-8 pb-8 sm:pt-12 sm:pb-12">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
              Ajoutez des produits, créez des paniers recette ou ajoutez des paniers préconfigurés pour commencer
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button 
                onClick={() => navigate('/produits')}
                className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
              >
                Voir les produits
              </Button>
              <Button 
                onClick={() => navigate('/recettes')}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Voir les recettes
              </Button>
              <Button 
                onClick={() => navigate('/paniers-preconfigures')}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Paniers préconfigurés
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Affichage des paniers groupés par type */}
      {Object.entries(groupedItems).map(([cartType, items]) => (
        <Card key={cartType} className="shadow-lg">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center text-lg sm:text-xl">
              {getCartIcon(cartType)}
              <span className="ml-2">
                Panier {getCartTypeLabel(cartType)} ({items.length} {items.length > 1 ? 'articles' : 'article'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {items.map((item) => (
              <div key={`${item.cart_type}-${item.item_id}`} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {item.cart_name}
                    </Badge>
                    {cartType === 'preconfigured' && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        Panier complet
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium mt-2">{item.product_name}</h3>
                  {cartType !== 'preconfigured' && (
                    <p className="text-sm text-gray-600">
                      Quantité: {item.quantity} × {formatCFA(item.unit_price || 0)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-orange-600">
                    {formatCFA(item.total_price || 0)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Résumé de commande */}
      <Card className="shadow-xl border-2 border-orange-200">
        <CardHeader className="pb-3 sm:pb-6 bg-gradient-to-r from-orange-50 to-red-50">
          <CardTitle className="text-lg sm:text-xl flex items-center">
            <Package className="h-6 w-6 mr-2 text-orange-600" />
            Résumé de commande
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm sm:text-base">
              <span>Sous-total ({cartItems.length} articles)</span>
              <span className="font-medium">{formatCFA(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span>Frais de livraison</span>
              <span className="font-medium text-orange-600">{formatCFA(DELIVERY_FEE)}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg sm:text-xl">
            <span>Total</span>
            <span className="text-orange-600">{formatCFA(subtotal + DELIVERY_FEE)}</span>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium flex items-center">
              💰 Paiement à la livraison
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Vous payerez en espèces lors de la réception de votre commande
            </p>
          </div>

          <Button 
            onClick={() => setShowOrderForm(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm sm:text-base py-3 sm:py-4 font-semibold shadow-lg"
            disabled={subtotal === 0}
          >
            <Package className="h-5 w-5 mr-2" />
            Passer commande ({formatCFA(subtotal + DELIVERY_FEE)})
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainCartView;

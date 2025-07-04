import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Trash2, Plus, Minus, AlertCircle, ArrowRight, ChefHat } from 'lucide-react';
import { useMainCart } from '@/hooks/useSupabaseCart';
import { formatCFA, DELIVERY_FEE } from '@/lib/currency';
import { useToast } from '@/hooks/use-toast';
import { MainCartItem } from '@/types/cart';
import SimpleOrderForm from './SimpleOrderForm';
import OrderSuccess from './OrderSuccess';
const MainCartView = () => {
  const {
    cartItems,
    isLoading
  } = useMainCart();
  const {
    toast
  } = useToast();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>('');
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-2">Chargement du panier...</span>
      </div>;
  }
  if (!cartItems || cartItems.length === 0) {
    return <Card className="text-center py-12">
        <CardContent>
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Votre panier est vide</h3>
          <p className="text-gray-500 mb-6">
            Ajoutez des produits à votre panier pour commencer vos achats
          </p>
          <Button onClick={() => window.location.href = '/produits'} className="bg-orange-500 hover:bg-orange-600">
            <Package className="h-4 w-4 mr-2" />
            Découvrir nos produits
          </Button>
        </CardContent>
      </Card>;
  }

  // Calculer le sous-total
  const subtotal = cartItems.reduce((total, item) => total + (item.total_price || 0), 0);
  const total = subtotal + DELIVERY_FEE;

  // Grouper les items par type de panier
  const personalItems = cartItems.filter(item => item.cart_type === 'personal');
  const recipeItems = cartItems.filter(item => item.cart_type === 'recipe');
  const preconfiguredItems = cartItems.filter(item => item.cart_type === 'preconfigured');

  // Grouper les items de recettes par panier individuel
  const recipeCartGroups = recipeItems.reduce((groups, item) => {
    const cartId = item.cart_id;
    if (!groups[cartId]) {
      groups[cartId] = {
        cartName: item.cart_name,
        items: []
      };
    }
    groups[cartId].items.push(item);
    return groups;
  }, {} as Record<string, {
    cartName: string;
    items: MainCartItem[];
  }>);
  const handleOrderComplete = (orderId?: string) => {
    setShowOrderForm(false);
    setShowOrderSuccess(true);
    if (orderId) {
      setCompletedOrderId(orderId);
    }

    // Actualiser la page après un délai pour s'assurer que les paniers sont vides
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  const handleContinueShopping = () => {
    setShowOrderSuccess(false);
    window.location.href = '/produits';
  };
  if (showOrderSuccess) {
    return <OrderSuccess orderId={completedOrderId} onContinueShopping={handleContinueShopping} />;
  }
  if (showOrderForm) {
    return <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Finaliser la commande</h2>
          <Button variant="outline" onClick={() => setShowOrderForm(false)}>
            Retour au panier
          </Button>
        </div>
        
        <SimpleOrderForm cartItems={cartItems} subtotal={subtotal} onOrderComplete={handleOrderComplete} />
      </div>;
  }
  return <div className="space-y-6">
      {/* En-tête du panier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Panier principal
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Items du panier groupés par type */}
      <div className="space-y-4">
        {/* Panier personnel */}
        {personalItems.length > 0 && <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Package className="h-4 w-4 mr-2 text-blue-500" />
                Panier Personnel
                <Badge variant="outline" className="ml-2">
                  {personalItems.length} article{personalItems.length > 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {personalItems.map(item => <div key={`personal-${item.item_id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × {formatCFA(item.unit_price)} = {formatCFA(item.total_price)}
                      </p>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>}

        {/* Paniers recettes - séparés individuellement */}
        {Object.entries(recipeCartGroups).map(([cartId, cartGroup]) => <Card key={cartId}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <ChefHat className="h-4 w-4 mr-2 text-green-500" />
                {cartGroup.cartName}
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                  {cartGroup.items.length} article{cartGroup.items.length > 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cartGroup.items.map(item => <div key={`recipe-${item.item_id}`} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-green-800">{item.product_name}</h4>
                      <p className="text-sm text-green-600">
                        {item.quantity} × {formatCFA(item.unit_price)} = {formatCFA(item.total_price)}
                      </p>
                    </div>
                  </div>)}
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700">Total du panier:</span>
                    <span className="font-bold text-green-800">
                      {formatCFA(cartGroup.items.reduce((sum, item) => sum + (item.total_price || 0), 0))}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>)}

        {/* Paniers préconfigurés */}
        {preconfiguredItems.length > 0 && <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Package className="h-4 w-4 mr-2 text-purple-500" />
                Paniers Préconfigurés
                <Badge variant="outline" className="ml-2">
                  {preconfiguredItems.length} panier{preconfiguredItems.length > 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {preconfiguredItems.map(item => <div key={`preconfigured-${item.item_id}`} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-purple-800">{item.product_name}</h4>
                      <p className="text-sm text-purple-600">
                        Panier complet - {formatCFA(item.total_price)}
                      </p>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>}
      </div>

      {/* Résumé et commande */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Résumé des prix */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total ({cartItems.length} articles)</span>
                <span>{formatCFA(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frais de livraison</span>
                <span>{formatCFA(DELIVERY_FEE)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-500">{formatCFA(total)}</span>
              </div>
            </div>

            {/* Informations de livraison */}
            

            {/* Bouton de commande */}
            <Button onClick={() => setShowOrderForm(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg" size="lg">
              <ArrowRight className="h-5 w-5 mr-2" />
              Commander - {formatCFA(total)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default MainCartView;
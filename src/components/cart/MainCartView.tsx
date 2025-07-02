
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Package, ChefHat, User, Plus, Minus, Trash2 } from 'lucide-react';
import { usePersonalCart, useRecipeUserCarts } from '@/hooks/useSupabaseCart';
import { formatCFA, DELIVERY_FEE } from '@/lib/currency';
import { useNavigate } from 'react-router-dom';
import SimpleOrderForm from './SimpleOrderForm';

const MainCartView = () => {
  const { personalCart, personalCartItems, updateQuantity, removeItem } = usePersonalCart();
  const { recipeCarts } = useRecipeUserCarts();
  const navigate = useNavigate();
  const [showOrderForm, setShowOrderForm] = useState(false);

  const personalCartTotal = personalCartItems.reduce((sum, item) => 
    sum + ((item.products?.price || 0) * item.quantity), 0
  );

  const recipeCartsTotal = recipeCarts.reduce((sum, cart) => {
    return sum; // À implémenter si nécessaire
  }, 0);

  const subtotal = personalCartTotal + recipeCartsTotal;
  const allCartItems = [...personalCartItems];

  const handleQuantityChange = (itemId: string, currentQuantity: number, increment: boolean) => {
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity > 0) {
      updateQuantity({ itemId, quantity: newQuantity });
    }
  };

  const handleOrderComplete = () => {
    setShowOrderForm(false);
    navigate('/profile'); // Rediriger vers le profil où l'utilisateur peut voir ses commandes
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
          cartItems={allCartItems}
          subtotal={subtotal}
          onOrderComplete={handleOrderComplete}
        />
      </div>
    );
  }

  if (allCartItems.length === 0) {
    return (
      <Card>
        <CardContent className="pt-8 pb-8 sm:pt-12 sm:pb-12">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">Ajoutez des produits ou créez des paniers recette pour commencer</p>
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
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Articles du panier personnel */}
      {personalCartItems.length > 0 && (
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <User className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="truncate">Panier Personnel ({personalCartItems.length} articles)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {personalCartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <img 
                  src={item.products?.image || '/placeholder.svg'} 
                  alt={item.products?.name || ''}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.products?.name}</h3>
                  <Badge variant="outline" className="text-xs mt-1">
                    {item.products?.category}
                  </Badge>
                  <p className="text-orange-500 font-semibold mt-1">
                    {formatCFA(item.products?.price || 0)}
                  </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.id, item.quantity, false)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.id, item.quantity, true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Résumé de commande */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Résumé de commande</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm sm:text-base">
              <span>Sous-total ({allCartItems.length} articles)</span>
              <span className="font-medium">{formatCFA(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span>Frais de livraison</span>
              <span className="font-medium text-orange-600">{formatCFA(DELIVERY_FEE)}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-semibold text-base sm:text-lg">
            <span>Total</span>
            <span className="text-orange-500">{formatCFA(subtotal + DELIVERY_FEE)}</span>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">💰 Paiement à la livraison</p>
            <p className="text-xs text-blue-600 mt-1">Vous payerez en espèces lors de la réception de votre commande</p>
          </div>

          <Button 
            onClick={() => setShowOrderForm(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base py-2 sm:py-3"
            disabled={subtotal === 0}
          >
            <Package className="h-4 w-4 mr-2" />
            Passer commande ({formatCFA(subtotal + DELIVERY_FEE)})
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainCartView;

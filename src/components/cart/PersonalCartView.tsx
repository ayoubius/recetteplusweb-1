
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Plus, Minus, Trash2 } from 'lucide-react';
import { usePersonalCart } from '@/hooks/useSupabaseCart';
import { formatCFA } from '@/lib/currency';

const PersonalCartView = () => {
  const { 
    personalCart, 
    personalCartItems, 
    isLoading, 
    updateQuantity, 
    removeItem,
    isUpdating,
    isRemoving
  } = usePersonalCart();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!personalCart || personalCartItems.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12">
          <div className="text-center">
            <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Panier personnel vide</h3>
            <p className="text-gray-600 mb-6">
              Ajoutez des produits depuis la page produits pour créer votre panier personnalisé
            </p>
            <p className="text-sm text-gray-500">
              Les produits ajoutés seront automatiquement inclus dans votre panier principal
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const subtotal = personalCartItems.reduce((sum, item) => 
    sum + ((item.products?.price || 0) * item.quantity), 0
  );

  const handleQuantityChange = (itemId: string, currentQuantity: number, increment: boolean) => {
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
    updateQuantity({ itemId, quantity: newQuantity });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Panier Personnel ({personalCartItems.length} articles)
          </CardTitle>
          <p className="text-sm text-gray-600">
            Automatiquement ajouté au panier principal
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {personalCartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <img 
                src={item.products?.image || '/placeholder.svg'} 
                alt={item.products?.name || ''}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.products?.name}</h3>
                <Badge variant="outline" className="text-xs mt-1">
                  {item.products?.category}
                </Badge>
                <p className="text-orange-500 font-semibold mt-1">
                  {formatCFA(item.products?.price || 0)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(item.id, item.quantity, false)}
                  disabled={isUpdating}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(item.id, item.quantity, true)}
                  disabled={isUpdating}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700"
                onClick={() => removeItem(item.id)}
                disabled={isRemoving}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résumé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total</span>
            <span className="text-orange-500">{formatCFA(subtotal)}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Ce panier est automatiquement inclus dans votre panier principal
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalCartView;

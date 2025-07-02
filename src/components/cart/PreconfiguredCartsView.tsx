
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Trash2 } from 'lucide-react';
import { usePreconfiguredCarts } from '@/hooks/useSupabaseCart';
import { formatCFA } from '@/lib/currency';

const PreconfiguredCartsView = () => {
  const {
    userPreconfiguredCarts,
    isLoadingUserCarts,
    removeUserCart,
    isRemoving
  } = usePreconfiguredCarts();

  if (isLoadingUserCarts) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (userPreconfiguredCarts.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Aucun panier préconfiguré
          </h3>
          <p className="text-gray-500 text-center mb-4">
            Découvrez nos paniers préconfigurés pour gagner du temps lors de vos achats
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Mes Paniers Préconfigurés</h2>
        <Badge variant="outline">
          {userPreconfiguredCarts.length} panier{userPreconfiguredCarts.length > 1 ? 's' : ''}
        </Badge>
      </div>

      {userPreconfiguredCarts.map((userCart) => (
        <Card key={userCart.id} className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    {userCart.preconfigured_carts?.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {userCart.preconfigured_carts?.category}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Actif dans le panier
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {userCart.preconfigured_carts?.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-orange-600">
                  {formatCFA(userCart.preconfigured_carts?.total_price || 0)}
                </div>
                <div className="text-sm text-gray-500">
                  Ajouté le {new Date(userCart.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">
                  ✅ Ce panier est automatiquement inclus dans votre panier principal
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Tous vos paniers sont pris en compte lors de la commande
                </p>
              </div>

              <div className="flex justify-end pt-3">
                <Button
                  onClick={() => removeUserCart(userCart.id)}
                  disabled={isRemoving}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  {isRemoving ? (
                    <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="ml-2">Supprimer</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PreconfiguredCartsView;

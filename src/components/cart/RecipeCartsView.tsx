
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, ShoppingCart, Trash2, Plus, Clock } from 'lucide-react';
import { useRecipeUserCarts } from '@/hooks/useSupabaseCart';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const RecipeCartsView = () => {
  const { recipeCarts, isLoading, addToMainCart, removeRecipeCart, isAddingToMain, isRemoving } = useRecipeUserCarts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (recipeCarts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12">
          <div className="text-center">
            <ChefHat className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun panier recette</h3>
            <p className="text-gray-600 mb-6">Créez des paniers depuis vos recettes favorites</p>
            <Button className="bg-orange-500 hover:bg-orange-600">
              Voir les recettes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mes Paniers Recettes</h2>
        <Badge variant="outline">{recipeCarts.length} panier{recipeCarts.length > 1 ? 's' : ''}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recipeCarts.map((recipeCart) => (
          <Card key={recipeCart.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative">
              {recipeCart.recipes?.image && (
                <img 
                  src={recipeCart.recipes.image} 
                  alt={recipeCart.recipes.title}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
              )}
              <div className="absolute top-2 right-2">
                {recipeCart.is_added_to_main_cart ? (
                  <Badge className="bg-green-500">
                    Ajouté au panier
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    En attente
                  </Badge>
                )}
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {recipeCart.cart_name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {recipeCart.recipes?.title}
                  </p>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {format(new Date(recipeCart.created_at), 'dd/MM/yyyy', { locale: fr })}
                </div>

                <div className="flex space-x-2">
                  {!recipeCart.is_added_to_main_cart ? (
                    <Button
                      onClick={() => addToMainCart(recipeCart.id)}
                      disabled={isAddingToMain}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      size="sm"
                    >
                      {isAddingToMain ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Ajouter au panier
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1"
                      size="sm"
                      disabled
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Dans le panier
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRecipeCart(recipeCart.id)}
                    disabled={isRemoving}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecipeCartsView;

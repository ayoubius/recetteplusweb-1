
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Trash2, Clock, Users } from 'lucide-react';
import { useRecipeUserCarts } from '@/hooks/useSupabaseCart';
import { formatCFA } from '@/lib/currency';

const RecipeCartsView = () => {
  const {
    recipeCarts,
    isLoading,
    removeRecipeCart,
    isRemoving
  } = useRecipeUserCarts();

  if (isLoading) {
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

  if (recipeCarts.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ChefHat className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Aucun panier recette
          </h3>
          <p className="text-gray-500 text-center mb-4">
            Ajoutez des recettes à votre panier pour voir leurs ingrédients ici
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Mes Paniers Recettes</h2>
        <Badge variant="outline">
          {recipeCarts.length} panier{recipeCarts.length > 1 ? 's' : ''}
        </Badge>
      </div>

      {recipeCarts.map((recipeCart) => (
        <Card key={recipeCart.id} className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    {recipeCart.cart_name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Recette: {recipeCart.recipes?.title}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Panier Recette
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Informations sur la recette */}
              {recipeCart.recipes && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-800">
                      {recipeCart.recipes.title}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-green-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {recipeCart.recipes.cook_time} min
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {recipeCart.recipes.servings} portions
                    </div>
                  </div>
                </div>
              )}

              {/* Liste des ingrédients */}
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Ingrédients ({recipeCart.recipe_cart_items?.length || 0})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recipeCart.recipe_cart_items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">
                        {item.products?.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          x{item.quantity}
                        </Badge>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCFA((item.products?.price || 0) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total et actions */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-lg font-bold text-green-600">
                  Total: {formatCFA(
                    recipeCart.recipe_cart_items?.reduce(
                      (total, item) => total + ((item.products?.price || 0) * item.quantity),
                      0
                    ) || 0
                  )}
                </div>
                <Button
                  onClick={() => removeRecipeCart(recipeCart.id)}
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

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">
                  ✅ Ce panier recette est automatiquement inclus dans votre panier principal
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Ajouté le {new Date(recipeCart.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecipeCartsView;

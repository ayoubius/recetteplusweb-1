
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Users, 
  Star, 
  Play, 
  ShoppingCart, 
  Plus, 
  Package,
  ChefHat,
  ArrowLeft
} from 'lucide-react';
import { useSupabaseRecipes } from '@/hooks/useSupabaseRecipes';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { useRecipeUserCarts } from '@/hooks/useSupabaseCart';
import { formatCFA } from '@/lib/currency';
import { useToast } from '@/hooks/use-toast';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: recipes = [], isLoading: recipeLoading } = useSupabaseRecipes();
  const { data: products = [] } = useSupabaseProducts();
  const { createRecipeCart, isCreating } = useRecipeUserCarts();
  const { toast } = useToast();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const recipe = recipes.find(r => r.id === id);

  if (recipeLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Recette non trouvée</h1>
        <Link to="/recettes">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux recettes
          </Button>
        </Link>
      </div>
    );
  }

  // Trouver les produits correspondant aux ingrédients
  const getProductsForIngredients = () => {
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
      return [];
    }

    return recipe.ingredients
      .map((ingredient: any) => {
        if (typeof ingredient === 'object' && ingredient.product_id) {
          const product = products.find(p => p.id === ingredient.product_id);
          return product ? { ...product, recipeQuantity: ingredient.quantity, unit: ingredient.unit } : null;
        }
        return null;
      })
      .filter(Boolean);
  };

  const recipeProducts = getProductsForIngredients();

  const handleAddIngredientToCart = async (productId: string) => {
    try {
      // Cette fonction pourrait être améliorée pour ajouter individuellement
      setSelectedIngredients(prev => [...prev, productId]);
      toast({
        title: "Ingrédient sélectionné",
        description: "Utilisez 'Créer panier recette' pour ajouter tous les ingrédients."
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleCreateRecipeCart = async () => {
    try {
      const ingredients = recipeProducts
        .filter(product => product)
        .map(product => ({
          productId: product!.id,
          quantity: 1 // Pourrait être basé sur recipeQuantity
        }));

      if (ingredients.length === 0) {
        toast({
          title: "Aucun ingrédient",
          description: "Cette recette n'a pas d'ingrédients disponibles.",
          variant: "destructive"
        });
        return;
      }

      createRecipeCart({
        recipeId: recipe.id,
        cartName: `Panier - ${recipe.title}`,
        ingredients
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/recettes">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux recettes
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image et infos principales */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={recipe.image || '/placeholder.svg'} 
                  alt={recipe.title}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                {recipe.video_id && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                      <Play className="h-6 w-6 mr-2" />
                      Voir la vidéo
                    </Button>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{recipe.category}</Badge>
                  {recipe.difficulty && (
                    <Badge variant="outline">{recipe.difficulty}</Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {recipe.prep_time && `${recipe.prep_time}min préparation + `}
                    {recipe.cook_time}min cuisson
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {recipe.servings} personnes
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {recipe.rating || 0}/5
                  </div>
                </div>

                {recipe.description && (
                  <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChefHat className="h-5 w-5 mr-2" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex">
                      <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Ingrédients et produits */}
          <div className="space-y-6">
            {/* Ingrédients avec produits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Ingrédients ({recipeProducts.length})
                  </span>
                  {recipeProducts.length > 0 && (
                    <Button
                      size="sm"
                      onClick={handleCreateRecipeCart}
                      disabled={isCreating}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Créer panier recette
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recipeProducts.length > 0 ? (
                  recipeProducts.map((product) => {
                    if (!product) return null;
                    const isSelected = selectedIngredients.includes(product.id);
                    
                    return (
                      <div key={product.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start space-x-3">
                          <img 
                            src={product.image || '/placeholder.svg'} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{product.name}</h4>
                            <p className="text-xs text-gray-500">{product.recipeQuantity} {product.unit}</p>
                            <p className="text-orange-500 font-semibold text-sm">
                              {formatCFA(product.price)}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddIngredientToCart(product.id)}
                          disabled={isCreating || isSelected}
                          className={`w-full ${isSelected ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                        >
                          {isSelected ? (
                            <>✓ Sélectionné</>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              Sélectionner
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">
                      Aucun produit disponible pour cette recette
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations nutritionnelles */}
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Temps total</span>
                  <span>{(recipe.prep_time || 0) + recipe.cook_time} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Portions</span>
                  <span>{recipe.servings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulté</span>
                  <span>{recipe.difficulty || 'Non spécifiée'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vues</span>
                  <span>{recipe.view_count || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;

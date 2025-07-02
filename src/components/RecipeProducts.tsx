
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Plus } from 'lucide-react';
import { useRecipeProducts } from '@/hooks/useRecipeProducts';
import { useRecipeUserCarts } from '@/hooks/useSupabaseCart';
import { formatCFA } from '@/lib/currency';
import { useToast } from '@/hooks/use-toast';

interface RecipeProductsProps {
  recipeId: string;
  recipeTitle: string;
}

const RecipeProducts: React.FC<RecipeProductsProps> = ({ recipeId, recipeTitle }) => {
  const { data: products = [], isLoading } = useRecipeProducts(recipeId);
  const { createRecipeCart, isCreating } = useRecipeUserCarts();
  const { toast } = useToast();

  const handleCreateRecipeCart = async () => {
    try {
      const ingredients = products.map(product => ({
        productId: product.id,
        quantity: 1
      }));

      if (ingredients.length === 0) {
        toast({
          title: "Aucun produit",
          description: "Cette recette n'a pas de produits disponibles.",
          variant: "destructive"
        });
        return;
      }

      await createRecipeCart({
        recipeId,
        cartName: `Panier - ${recipeTitle}`,
        ingredients
      });

      toast({
        title: "Panier recette créé",
        description: `Le panier pour "${recipeTitle}" a été créé avec succès.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le panier recette.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Produits de la recette
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Produits de la recette
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun produit disponible pour cette recette</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Produits de la recette ({products.length})
          </span>
          <Button
            onClick={handleCreateRecipeCart}
            disabled={isCreating}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isCreating ? 'Création...' : 'Créer panier recette'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <img 
                src={product.image || '/placeholder.svg'} 
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-sm text-gray-600">
                  Quantité: {product.recipeQuantity} {product.unit}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{product.category}</Badge>
                  <span className="text-orange-500 font-semibold">
                    {formatCFA(product.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecipeProducts;

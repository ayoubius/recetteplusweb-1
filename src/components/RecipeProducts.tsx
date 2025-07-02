
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus } from 'lucide-react';
import { formatCFA } from '@/lib/currency';
import { useRecipeProducts } from '@/hooks/useRecipeProducts';
import { useRecipeUserCarts } from '@/hooks/useSupabaseCart';

interface RecipeProductsProps {
  recipeId: string;
  recipeName: string;
}

const RecipeProducts = ({ recipeId, recipeName }: RecipeProductsProps) => {
  const { data: recipeProducts = [], isLoading } = useRecipeProducts(recipeId);
  const { createRecipeCart, isCreating } = useRecipeUserCarts();

  const handleAddRecipeToCart = () => {
    const ingredients = recipeProducts.map(item => ({
      productId: item.product.id,
      quantity: parseInt(item.quantity) || 1,
    }));

    createRecipeCart({
      recipeId,
      cartName: `Recette: ${recipeName}`,
      ingredients,
    });
  };

  if (isLoading || recipeProducts.length === 0) return null;

  const totalPrice = recipeProducts.reduce((sum, item) => 
    sum + (item.product?.price || 0) * (parseInt(item.quantity) || 1), 0
  );

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Ingrédients requis</span>
          <Button 
            onClick={handleAddRecipeToCart}
            disabled={isCreating}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isCreating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            Ajouter au panier ({formatCFA(totalPrice)})
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipeProducts.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
              <img 
                src={item.product?.image || '/placeholder.svg'} 
                alt={item.product?.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.product?.name}</h4>
                <p className="text-sm text-gray-600">
                  {item.quantity} {item.unit}
                </p>
                <p className="text-sm font-semibold text-orange-500">
                  {formatCFA(item.product?.price || 0)}
                </p>
              </div>
              <Badge variant="outline">
                {item.product?.category}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeProducts;

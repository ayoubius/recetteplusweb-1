
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
  ChefHat,
  ArrowLeft,
  Heart
} from 'lucide-react';
import { useSupabaseRecipes } from '@/hooks/useSupabaseRecipes';
import RecipeProducts from '@/components/RecipeProducts';
import { useSupabaseFavorites } from '@/hooks/useSupabaseFavorites';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: recipes = [], isLoading: recipeLoading } = useSupabaseRecipes();
  const { addFavorite, removeFavorite, data: favorites = [] } = useSupabaseFavorites();

  const recipe = recipes.find(r => r.id === id);
  const isRecipeFavorite = recipe ? favorites.some(fav => fav.item_id === recipe.id && fav.type === 'recipe') : false;

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
                    <Link to={`/videos/${recipe.video_id}`}>
                      <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                        <Play className="h-6 w-6 mr-2" />
                        Voir la vidéo
                      </Button>
                    </Link>
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

                <div className="mt-4">
                  <Button 
                    className={`${isRecipeFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                    onClick={() => isRecipeFavorite ? removeFavorite({itemId: recipe.id, type: 'recipe'}) : addFavorite({itemId: recipe.id, type: 'recipe'})}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isRecipeFavorite ? 'fill-current' : ''}`} />
                    {isRecipeFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </Button>
                </div>
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

            {/* Produits de la recette */}
            <RecipeProducts 
              recipeId={recipe.id} 
              recipeTitle={recipe.title}
            />
          </div>

          {/* Sidebar - Informations */}
          <div className="space-y-6">
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

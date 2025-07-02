
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Users, Star, Play, ChefHat } from 'lucide-react';
import { useSupabaseRecipes } from '@/hooks/useSupabaseRecipes';
import { useSupabaseVideos } from '@/hooks/useSupabaseVideos';
import { supabase } from '@/integrations/supabase/client';
import RecipeProducts from '@/components/RecipeProducts';
import FavoriteButton from '@/components/FavoriteButton';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: recipes = [] } = useSupabaseRecipes();
  const { data: videos = [] } = useSupabaseVideos();
  const recipe = recipes.find(r => r.id === id);
  const associatedVideos = videos.filter(v => v.recipe_id === id);

  useEffect(() => {
    if (id) {
      // Incrémenter le nombre de vues de la recette
      supabase.rpc('increment_recipe_views', { recipe_uuid: id });
    }
  }, [id]);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recette non trouvée</h2>
          <Button onClick={() => navigate('/recettes')} className="bg-orange-500 hover:bg-orange-600">
            Retour aux recettes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/recettes')}
          variant="outline" 
          className="mb-6 hover:bg-white/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux recettes
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* En-tête de la recette */}
            <Card className="overflow-hidden">
              <div className="relative h-80">
                <img 
                  src={recipe.image || 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800'}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-orange-500">{recipe.category}</Badge>
                    <FavoriteButton
                      itemId={recipe.id}
                      type="recipe"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.prep_time + recipe.cook_time} min total</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{recipe.servings} personnes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{recipe.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            {recipe.description && (
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Vidéos associées */}
            {associatedVideos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="h-5 w-5 text-orange-500" />
                    <span>Vidéos tutoriels</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {associatedVideos.map((video) => (
                      <div 
                        key={video.id}
                        className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                        onClick={() => navigate(`/videos/${video.id}`)}
                      >
                        <div className="relative">
                          <img 
                            src={video.thumbnail || '/placeholder.svg'}
                            alt={video.title}
                            className="w-24 h-16 object-cover rounded"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            {video.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {video.duration} • {video.views || 0} vues
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChefHat className="h-5 w-5 text-orange-500" />
                  <span>Instructions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex space-x-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Produits requis */}
            <RecipeProducts 
              recipeId={recipe.id}
              recipeName={recipe.title}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations de cuisson */}
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Préparation</span>
                  <span className="font-semibold">{recipe.prep_time} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cuisson</span>
                  <span className="font-semibold">{recipe.cook_time} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Portions</span>
                  <span className="font-semibold">{recipe.servings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulté</span>
                  <Badge variant="outline">{recipe.difficulty}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Note</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    <span className="font-semibold">{recipe.rating}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recettes similaires */}
            <Card>
              <CardHeader>
                <CardTitle>Recettes similaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recipes
                  .filter(r => r.id !== recipe.id && r.category === recipe.category)
                  .slice(0, 3)
                  .map((similarRecipe) => (
                    <div 
                      key={similarRecipe.id}
                      className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      onClick={() => navigate(`/recettes/${similarRecipe.id}`)}
                    >
                      <img 
                        src={similarRecipe.image || '/placeholder.svg'}
                        alt={similarRecipe.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          {similarRecipe.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <span>{similarRecipe.cook_time} min</span>
                          <span>•</span>
                          <span>{similarRecipe.servings} pers.</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;

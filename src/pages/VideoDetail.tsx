
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Clock, ArrowLeft, ChefHat } from 'lucide-react';
import { useSupabaseVideos } from '@/hooks/useSupabaseVideos';
import { useVideoRecipe } from '@/hooks/useVideoRecipe';
import VideoPlayer from '@/components/VideoPlayer';
import RecipeProducts from '@/components/RecipeProducts';
import { useSupabaseFavorites } from '@/hooks/useSupabaseFavorites';
import { supabase } from '@/integrations/supabase/client';

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: videos = [], isLoading } = useSupabaseVideos();
  const { addFavorite, removeFavorite, data: favorites = [] } = useSupabaseFavorites();
  
  const video = videos.find(v => v.id === id);
  const { data: relatedRecipe } = useVideoRecipe(video?.id || '');
  const isVideoFavorite = video ? favorites.some(fav => fav.item_id === video.id && fav.type === 'video') : false;

  // Incrémenter les vues quand la vidéo est chargée
  useEffect(() => {
    if (video?.id) {
      supabase.rpc('increment_video_views', { video_id: video.id });
    }
  }, [video?.id]);

  if (isLoading) {
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

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Vidéo non trouvée</h1>
        <Link to="/videos">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux vidéos
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
        <Link to="/videos">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux vidéos
          </Button>
        </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lecteur vidéo principal */}
          <div className="lg:col-span-3">
            <VideoPlayer
              videoUrl={video.video_url}
              thumbnail={video.thumbnail}
              title={video.title}
              videoId={video.id}
              className="mb-6"
            />

            {/* Informations sur la vidéo */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{video.category}</Badge>
                  {video.duration && (
                    <Badge variant="outline" className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {video.duration}
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{video.title}</h1>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {video.views || 0} vues
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {video.likes || 0} j'aime
                  </div>
                </div>

                {video.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {video.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recette associée */}
            {relatedRecipe && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ChefHat className="h-5 w-5 mr-2" />
                    Recette associée
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <img 
                      src={relatedRecipe.image || '/placeholder.svg'} 
                      alt={relatedRecipe.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{relatedRecipe.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {relatedRecipe.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>⏱️ {relatedRecipe.cook_time} min</span>
                        <span>👥 {relatedRecipe.servings} personnes</span>
                        <span>⭐ {relatedRecipe.rating || 0}/5</span>
                      </div>
                      <Link to={`/recettes/${relatedRecipe.id}`}>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          Voir la recette complète
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Produits de la recette */}
            {relatedRecipe && (
              <RecipeProducts 
                recipeId={relatedRecipe.id} 
                recipeTitle={relatedRecipe.title}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vues</span>
                  <span className="font-semibold">{video.views || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">J'aime</span>
                  <span className="font-semibold">{video.likes || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Durée</span>
                  <span className="font-semibold">{video.duration || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Catégorie</span>
                  <Badge variant="outline">{video.category}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Button 
                    className={`w-full ${isVideoFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                    onClick={() => isVideoFavorite ? removeFavorite({itemId: video.id, type: 'video'}) : addFavorite({itemId: video.id, type: 'video'})}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isVideoFavorite ? 'fill-current' : ''}`} />
                    {isVideoFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;

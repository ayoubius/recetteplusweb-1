
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Eye, Heart, Clock, Users, ChefHat } from 'lucide-react';
import { useSupabaseVideos } from '@/hooks/useSupabaseVideos';
import { useVideoRecipe } from '@/hooks/useVideoRecipe';
import { supabase } from '@/integrations/supabase/client';
import RecipeProducts from '@/components/RecipeProducts';
import FavoriteButton from '@/components/FavoriteButton';

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: videos = [] } = useSupabaseVideos();
  const video = videos.find(v => v.id === id);
  const { data: associatedRecipe } = useVideoRecipe(id || '');

  useEffect(() => {
    if (id) {
      // Incrémenter le nombre de vues
      supabase.rpc('increment_video_views', { video_id: id });
    }
  }, [id]);

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Vidéo non trouvée</h2>
          <Button onClick={() => navigate('/videos')} className="bg-orange-500 hover:bg-orange-600">
            Retour aux vidéos
          </Button>
        </div>
      </div>
    );
  }

  const formatDuration = (duration: string) => {
    if (!duration) return '0:00';
    return duration;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/videos')}
          variant="outline" 
          className="mb-6 hover:bg-white/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux vidéos
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vidéo principale */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-black">
                <img 
                  src={video.thumbnail || 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800'}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Button size="lg" className="bg-white/90 hover:bg-white text-orange-500 rounded-full p-4">
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(video.duration || '0:00')}</span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      {video.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{formatViews(video.views || 0)} vues</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{video.likes || 0} likes</span>
                      </div>
                    </div>
                  </div>
                  <FavoriteButton
                    itemId={video.id}
                    type="video"
                    className="bg-white hover:bg-gray-50 border"
                  />
                </div>
                
                <Badge className="mb-4 bg-orange-100 text-orange-800">
                  {video.category}
                </Badge>
                
                {video.description && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recette associée */}
            {associatedRecipe && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ChefHat className="h-5 w-5 text-orange-500" />
                    <span>Recette associée</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <img 
                      src={associatedRecipe.image || '/placeholder.svg'}
                      alt={associatedRecipe.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{associatedRecipe.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{associatedRecipe.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{associatedRecipe.cook_time} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{associatedRecipe.servings} pers.</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => navigate(`/recettes/${associatedRecipe.id}`)}
                        variant="outline"
                        className="text-orange-500 border-orange-500 hover:bg-orange-50"
                      >
                        Voir la recette complète
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Produits de la recette */}
            {associatedRecipe && (
              <RecipeProducts 
                recipeId={associatedRecipe.id}
                recipeName={associatedRecipe.title}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vidéos suggérées */}
            <Card>
              <CardHeader>
                <CardTitle>Vidéos suggérées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {videos
                  .filter(v => v.id !== video.id && v.category === video.category)
                  .slice(0, 4)
                  .map((suggestedVideo) => (
                    <div 
                      key={suggestedVideo.id}
                      className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      onClick={() => navigate(`/videos/${suggestedVideo.id}`)}
                    >
                      <img 
                        src={suggestedVideo.thumbnail || '/placeholder.svg'}
                        alt={suggestedVideo.title}
                        className="w-20 h-14 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          {suggestedVideo.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {formatViews(suggestedVideo.views || 0)} vues
                        </p>
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

export default VideoDetail;

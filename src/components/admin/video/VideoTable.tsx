
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Play, Clock, Heart, ChefHat } from 'lucide-react';
import { Video } from '@/hooks/useSupabaseVideos';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VideoTableProps {
  videos: Video[];
  onEdit?: (video: Video) => void;
  onDelete?: (id: string, title: string) => void;
  isLoading?: boolean;
}

const VideoTable: React.FC<VideoTableProps> = ({ 
  videos, 
  onEdit, 
  onDelete, 
  isLoading 
}) => {
  if (videos.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Play className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            Aucune vidéo trouvée
          </h3>
          <p className="text-gray-500">
            {onEdit ? 'Commencez par ajouter votre première vidéo.' : 'Aucune vidéo disponible.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vidéos ({videos.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                {video.thumbnail ? (
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-24 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Play className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {video.description || 'Pas de description'}
                    </p>
                  </div>
                  
                  {(onEdit || onDelete) && (
                    <div className="flex items-center space-x-2 ml-4">
                      {onEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(video)}
                          disabled={isLoading}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(video.id, video.title)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <Badge variant="outline">{video.category}</Badge>
                  
                  {video.duration && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{video.duration}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{video.views || 0} vues</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>{video.likes || 0} j'aime</span>
                  </div>

                  {video.recipes && (
                    <div className="flex items-center space-x-1">
                      <ChefHat className="h-4 w-4 text-orange-500" />
                      <span>{video.recipes.title}</span>
                    </div>
                  )}
                  
                  <span>{format(new Date(video.created_at), 'dd/MM/yyyy', { locale: fr })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoTable;

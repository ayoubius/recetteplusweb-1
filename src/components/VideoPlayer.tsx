
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnail?: string;
  title: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  thumbnail, 
  title, 
  className = "" 
}) => {
  if (!videoUrl) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <Play className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>Vidéo non disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si c'est un lien YouTube, extraire l'ID
  const getYouTubeEmbedUrl = (url: string) => {
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(youtubeRegex);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  };

  // Vérifier si c'est une URL YouTube
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const embedUrl = isYouTube ? getYouTubeEmbedUrl(videoUrl) : videoUrl;

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="relative w-full h-0 pb-[56.25%]"> {/* Aspect ratio 16:9 */}
          {isYouTube ? (
            <iframe
              src={embedUrl}
              title={title}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={videoUrl}
              poster={thumbnail}
              controls
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
              preload="metadata"
            >
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          )}
        </div>
        
        {/* Bouton pour ouvrir dans un nouvel onglet */}
        <div className="p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(videoUrl, '_blank')}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ouvrir dans un nouvel onglet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;

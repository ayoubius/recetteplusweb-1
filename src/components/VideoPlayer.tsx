
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ExternalLink, Maximize2, Volume2, VolumeX, Heart } from 'lucide-react';
import { useSupabaseVideos } from '@/hooks/useSupabaseVideos';
import { useSupabaseFavorites } from '@/hooks/useSupabaseFavorites';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnail?: string;
  title: string;
  className?: string;
  videoId?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  thumbnail, 
  title, 
  className = "",
  videoId
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | 'auto'>('16:9');
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Charger les likes au démarrage
  useEffect(() => {
    if (videoId) {
      loadVideoData();
    }
  }, [videoId]);

  const loadVideoData = async () => {
    if (!videoId) return;
    
    const { data: video } = await supabase
      .from('videos')
      .select('likes')
      .eq('id', videoId)
      .single();
      
    if (video) {
      setLikes(video.likes || 0);
    }
    
    // Vérifier si l'utilisateur a déjà liké
    if (currentUser) {
      const { data: userLike } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('item_id', videoId)
        .eq('type', 'video')
        .single();
        
      setHasLiked(!!userLike);
    }
  };

  const handleLike = async () => {
    if (!currentUser || !videoId) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour liker une vidéo",
        variant: "destructive",
      });
      return;
    }

    try {
      if (hasLiked) {
        // Retirer le like
        await supabase.rpc('decrement_video_likes', { video_id: videoId });
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('item_id', videoId)
          .eq('type', 'video');
        
        setLikes(prev => Math.max(0, prev - 1));
        setHasLiked(false);
        
        toast({
          title: "Like retiré",
          description: "Vous avez retiré votre like de cette vidéo",
        });
      } else {
        // Ajouter le like
        await supabase.rpc('increment_video_likes', { video_id: videoId });
        await supabase
          .from('favorites')
          .insert({
            user_id: currentUser.id,
            item_id: videoId,
            type: 'video'
          });
        
        setLikes(prev => prev + 1);
        setHasLiked(true);
        
        toast({
          title: "Vidéo likée !",
          description: "Merci pour votre soutien !",
        });
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre like",
        variant: "destructive",
      });
    }
  };

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

  // Détecter le ratio d'aspect de la vidéo
  const handleVideoLoad = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const width = video.videoWidth;
      const height = video.videoHeight;
      
      if (height > width) {
        setAspectRatio('9:16'); // Format vertical
      } else if (width > height) {
        setAspectRatio('16:9'); // Format horizontal
      } else {
        setAspectRatio('auto'); // Format carré ou autre
      }
    }
  };

  // Gérer le plein écran
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Écouter les changements de plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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

  // Déterminer les classes CSS selon le ratio d'aspect
  const getAspectRatioClasses = () => {
    if (isFullscreen) {
      return aspectRatio === '9:16' 
        ? 'w-auto h-full max-h-screen mx-auto' 
        : 'w-full h-full max-w-screen';
    }
    
    switch (aspectRatio) {
      case '9:16':
        return 'w-full max-w-sm mx-auto aspect-[9/16]'; // Format vertical, largeur limitée
      case '16:9':
        return 'w-full aspect-video'; // Format horizontal standard
      default:
        return 'w-full aspect-square'; // Format carré par défaut
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div 
          ref={containerRef}
          className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center' : ''}`}
        >
          <div className={`relative ${getAspectRatioClasses()}`}>
            {isYouTube ? (
              <iframe
                src={embedUrl}
                title={title}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                onLoad={handleVideoLoad}
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  poster={thumbnail}
                  controls={false}
                  muted={isMuted}
                  className="absolute top-0 left-0 w-full h-full object-contain rounded-lg bg-black"
                  preload="metadata"
                  onLoadedMetadata={handleVideoLoad}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
                
                {/* Contrôles personnalisés */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => {
                        if (videoRef.current) {
                          if (isPlaying) {
                            videoRef.current.pause();
                          } else {
                            videoRef.current.play();
                          }
                        }
                      }}
                    >
                      <Play className={`h-4 w-4 ${isPlaying ? 'hidden' : 'block'}`} />
                      <div className={`w-4 h-4 ${isPlaying ? 'block' : 'hidden'}`}>
                        <div className="flex space-x-1">
                          <div className="w-1 h-4 bg-white"></div>
                          <div className="w-1 h-4 bg-white"></div>
                        </div>
                      </div>
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => {
                        setIsMuted(!isMuted);
                        if (videoRef.current) {
                          videoRef.current.muted = !isMuted;
                        }
                      }}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-black/50 text-white text-xs">
                      {aspectRatio === '9:16' ? 'Vertical' : aspectRatio === '16:9' ? 'Horizontal' : 'Carré'}
                    </Badge>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={toggleFullscreen}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Boutons d'action - uniquement si pas en plein écran */}
        {!isFullscreen && (
          <div className="p-4 space-y-3">
            {/* Bouton Like */}
            {videoId && (
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className={`${hasLiked ? 'bg-red-50 border-red-200 text-red-600' : 'hover:bg-red-50'}`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${hasLiked ? 'fill-current' : ''}`} />
                  {likes} J'aime
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(videoUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir dans un nouvel onglet
                </Button>
              </div>
            )}
            
            {/* Bouton pour ouvrir dans un nouvel onglet si pas de videoId */}
            {!videoId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(videoUrl, '_blank')}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ouvrir dans un nouvel onglet
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;

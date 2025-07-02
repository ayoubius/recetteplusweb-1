
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from '@/components/FavoriteButton';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  views: number;
  category: string;
  chef: string;
  description: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  id,
  title,
  thumbnail,
  duration,
  views,
  category,
  chef,
  description
}) => {
  const navigate = useNavigate();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const handleClick = () => {
    navigate(`/videos/${id}`);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 food-shadow cursor-pointer" onClick={handleClick}>
      <div className="relative overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>{formatDuration(duration)}</span>
        </div>
        <FavoriteButton
          itemId={id}
          type="video"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-sm"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {category}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
            <div className="w-0 h-0 border-l-[8px] border-l-orange-500 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2 group-hover:text-orange-500 transition-colors mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="font-medium text-gray-700">{chef}</span>
          <span>{formatViews(views)} vues</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;

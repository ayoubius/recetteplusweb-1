
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Video } from 'lucide-react';

interface VideoHeaderProps {
  onAddVideo: () => void;
  videoCount: number;
}

const VideoHeader: React.FC<VideoHeaderProps> = ({ onAddVideo, videoCount }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Video className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des vidéos</h1>
          <p className="text-gray-600 mt-1">
            {videoCount} vidéo{videoCount > 1 ? 's' : ''} au total
          </p>
        </div>
      </div>
      <Button 
        type="button"
        className="bg-orange-500 hover:bg-orange-600 transition-all duration-200 shadow-lg"
        onClick={onAddVideo}
      >
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une vidéo
      </Button>
    </div>
  );
};

export default VideoHeader;

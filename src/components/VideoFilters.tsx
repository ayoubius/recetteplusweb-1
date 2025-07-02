
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SlidersHorizontal, X } from 'lucide-react';

interface VideoFiltersProps {
  onFiltersChange: (filters: any) => void;
  currentFilters: any;
}

const VideoFilters: React.FC<VideoFiltersProps> = ({ onFiltersChange, currentFilters }) => {
  const [localFilters, setLocalFilters] = React.useState(currentFilters);

  const handleDurationChange = (value: number[]) => {
    setLocalFilters({ ...localFilters, durationRange: value });
  };

  const handleViewsChange = (checked: boolean, viewsMin: number) => {
    setLocalFilters({ ...localFilters, minViews: checked ? viewsMin : 0 });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { durationRange: [0, 60], minViews: 0 };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto h-12 hover:bg-orange-50 border-orange-200">
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          Plus de filtres
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtres avancés</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Durée */}
          <div>
            <h4 className="font-medium mb-3">Durée (minutes)</h4>
            <Slider
              value={localFilters.durationRange || [0, 60]}
              onValueChange={handleDurationChange}
              max={60}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>{localFilters.durationRange?.[0] || 0} min</span>
              <span>{localFilters.durationRange?.[1] || 60} min</span>
            </div>
          </div>

          {/* Vues */}
          <div>
            <h4 className="font-medium mb-3">Popularité</h4>
            <div className="space-y-2">
              {[
                { label: 'Plus de 10K vues', value: 10000 },
                { label: 'Plus de 5K vues', value: 5000 },
                { label: 'Plus de 1K vues', value: 1000 },
                { label: 'Plus de 100 vues', value: 100 }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`views-${option.value}`}
                    checked={localFilters.minViews >= option.value}
                    onCheckedChange={(checked) => handleViewsChange(checked as boolean, option.value)}
                  />
                  <label htmlFor={`views-${option.value}`} className="text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            <Button onClick={clearFilters} variant="outline" className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Effacer
            </Button>
            <Button onClick={applyFilters} className="flex-1 bg-orange-500 hover:bg-orange-600">
              Appliquer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoFilters;

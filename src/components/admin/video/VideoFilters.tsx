
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { VideoFilters as VideoFiltersType } from '@/lib/videoService';

interface VideoFiltersProps {
  filters: VideoFiltersType;
  onFiltersChange: (filters: VideoFiltersType) => void;
  categories: string[];
  users: Array<{ uid: string; displayName?: string; email?: string }>;
}

const VideoFilters: React.FC<VideoFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  users
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      category: value === 'all' ? undefined : value 
    });
  };

  const handleUserChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      createdBy: value === 'all' ? undefined : value 
    });
  };

  const handleReset = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.searchTerm || filters.category || filters.createdBy;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par titre, description ou catégorie..."
                value={filters.searchTerm || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select 
              value={filters.category || 'all'} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.createdBy || 'all'} 
              onValueChange={handleUserChange}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tous les créateurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les créateurs</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.uid} value={user.uid}>
                    {user.displayName || user.email || 'Utilisateur sans nom'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex items-center"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            )}

            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoFilters;

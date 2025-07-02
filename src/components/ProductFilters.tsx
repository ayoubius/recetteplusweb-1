
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SlidersHorizontal, X } from 'lucide-react';

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void;
  currentFilters: any;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFiltersChange, currentFilters }) => {
  const [localFilters, setLocalFilters] = React.useState(currentFilters);

  const handlePriceChange = (value: number[]) => {
    setLocalFilters({ ...localFilters, priceRange: value });
  };

  const handleRatingChange = (checked: boolean, rating: number) => {
    const ratings = localFilters.ratings || [];
    if (checked) {
      setLocalFilters({ ...localFilters, ratings: [...ratings, rating] });
    } else {
      setLocalFilters({ ...localFilters, ratings: ratings.filter((r: number) => r !== rating) });
    }
  };

  const handleInStockChange = (checked: boolean) => {
    setLocalFilters({ ...localFilters, inStock: checked });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { priceRange: [0, 10000], ratings: [], inStock: false };
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
          {/* Prix */}
          <div>
            <h4 className="font-medium mb-3">Prix (F CFA)</h4>
            <Slider
              value={localFilters.priceRange || [0, 10000]}
              onValueChange={handlePriceChange}
              max={10000}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>{localFilters.priceRange?.[0] || 0} F</span>
              <span>{localFilters.priceRange?.[1] || 10000} F</span>
            </div>
          </div>

          {/* Note */}
          <div>
            <h4 className="font-medium mb-3">Note minimum</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={localFilters.ratings?.includes(rating)}
                    onCheckedChange={(checked) => handleRatingChange(checked as boolean, rating)}
                  />
                  <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                    {Array.from({ length: rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                    <span className="ml-1">et plus</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Disponibilité */}
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={localFilters.inStock}
                onCheckedChange={handleInStockChange}
              />
              <label htmlFor="in-stock" className="text-sm font-medium">
                Seulement les produits en stock
              </label>
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

export default ProductFilters;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';
import FavoriteButton from '@/components/FavoriteButton';

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  cookTime: number;
  servings: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  rating: number;
  category: string;
  description: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  image,
  cookTime,
  servings,
  difficulty,
  rating,
  category,
  description
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 food-shadow">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <FavoriteButton
          itemId={id}
          type="recipe"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-sm"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-orange-500 transition-colors">
            {title}
          </h3>
          <div className="flex items-center space-x-1 ml-2">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{cookTime}min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{servings}</span>
            </div>
          </div>
          <Badge variant="outline" className={getDifficultyColor(difficulty)}>
            {difficulty}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;

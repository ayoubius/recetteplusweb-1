
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChefHat, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import RecipeCard from '@/components/RecipeCard';
import { useSupabaseRecipes } from '@/hooks/useSupabaseRecipes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const { data: recipes = [], isLoading, error } = useSupabaseRecipes();

  const categories = [...new Set(recipes.map(recipe => recipe.category))];
  const difficulties = ['Facile', 'Moyen', 'Difficile'];

  const filteredAndSortedRecipes = recipes
    .filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'time-asc':
          return a.cook_time - b.cook_time;
        case 'time-desc':
          return b.cook_time - a.cook_time;
        case 'views':
          return (b.view_count || 0) - (a.view_count || 0);
        case 'popular':
        default:
          return (b.rating || 0) - (a.rating || 0);
      }
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Chargement des recettes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur lors du chargement des recettes</p>
          <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Nos Recettes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez plus de {recipes.length} recettes délicieuses préparées par nos chefs experts
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="Rechercher une recette..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg border-2 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category select */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 h-12">
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

              {/* Difficulty select */}
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full sm:w-40 h-12">
                  <SelectValue placeholder="Difficulté" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Quick Categories */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center animate-fade-in">
          <Badge 
            variant={selectedCategory === 'all' ? 'default' : 'outline'} 
            className="cursor-pointer hover:bg-orange-500 hover:text-white transition-all duration-300 px-4 py-2 text-sm font-semibold bg-orange-500 text-white"
            onClick={() => setSelectedCategory('all')}
          >
            Toutes ({recipes.length})
          </Badge>
          {categories.slice(0, 6).map((category) => {
            const count = recipes.filter(r => r.category === category).length;
            return (
              <Badge 
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-orange-500 hover:text-white transition-all duration-300 px-4 py-2 text-sm font-semibold"
                onClick={() => setSelectedCategory(category)}
                style={selectedCategory === category ? { backgroundColor: '#F97316', color: 'white' } : {}}
              >
                {category} ({count})
              </Badge>
            );
          })}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600 text-lg">
              <span className="font-semibold text-orange-600">{filteredAndSortedRecipes.length}</span> recette{filteredAndSortedRecipes.length > 1 ? 's' : ''} trouvée{filteredAndSortedRecipes.length > 1 ? 's' : ''}
            </p>
            {searchTerm && (
              <Badge variant="secondary" className="px-3 py-1">
                Recherche: "{searchTerm}"
              </Badge>
            )}
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Plus populaires</SelectItem>
              <SelectItem value="recent">Plus récentes</SelectItem>
              <SelectItem value="rating">Mieux notées</SelectItem>
              <SelectItem value="views">Plus vues</SelectItem>
              <SelectItem value="time-asc">Temps croissant</SelectItem>
              <SelectItem value="time-desc">Temps décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recipe Grid */}
        {filteredAndSortedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {filteredAndSortedRecipes.map((recipe) => (
              <Link key={recipe.id} to={`/recettes/${recipe.id}`}>
                <RecipeCard 
                  id={recipe.id}
                  title={recipe.title}
                  image={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                  cookTime={recipe.cook_time}
                  servings={recipe.servings}
                  difficulty={(recipe.difficulty as 'Facile' | 'Moyen' | 'Difficile') || 'Facile'}
                  rating={recipe.rating || 0}
                  category={recipe.category}
                  description={recipe.description || ''}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="h-12 w-12 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune recette trouvée</h3>
            <p className="text-gray-500">
              {searchTerm 
                ? `Aucune recette ne correspond à "${searchTerm}"`
                : "Aucune recette disponible dans cette catégorie"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;

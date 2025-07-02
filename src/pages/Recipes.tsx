
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, Clock, Users, ChefHat, Loader2, X } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import { useSupabaseRecipes } from '@/hooks/useSupabaseRecipes';
import Header from '@/components/Header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced filters
  const [cookTimeRange, setCookTimeRange] = useState([0, 120]);
  const [servingsRange, setServingsRange] = useState([1, 10]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const { data: recipes = [], isLoading, error } = useSupabaseRecipes();

  const categories = [...new Set(recipes.map(recipe => recipe.category))];
  const difficulties = ['Facile', 'Moyen', 'Difficile'];
  const commonIngredients = ['Riz', 'Viande', 'Poisson', 'Légumes', 'Épices', 'Huile', 'Oignon', 'Tomate'];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
    const matchesCookTime = recipe.cook_time >= cookTimeRange[0] && recipe.cook_time <= cookTimeRange[1];
    const matchesServings = recipe.servings >= servingsRange[0] && recipe.servings <= servingsRange[1];
    const matchesRating = (recipe.rating || 0) >= minRating;
    const matchesIngredients = selectedIngredients.length === 0 || 
      selectedIngredients.some(ingredient => 
        recipe.title.toLowerCase().includes(ingredient.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(ingredient.toLowerCase())
      );

    return matchesSearch && matchesCategory && matchesDifficulty && 
           matchesCookTime && matchesServings && matchesRating && matchesIngredients;
  });

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setCookTimeRange([0, 120]);
    setServingsRange([1, 10]);
    setSelectedIngredients([]);
    setMinRating(0);
  };

  const handleIngredientChange = (ingredient: string, checked: boolean) => {
    if (checked) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    } else {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
    }
  };

  if (isLoading) {
    return (
      <>
   
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-gray-600">Chargement des recettes...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erreur lors du chargement des recettes</p>
            <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
              Réessayer
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
     
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              Nos Recettes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez plus de {recipes.length} recettes authentiques de la cuisine malienne
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

              {/* Basic Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
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

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-full sm:w-48 h-12">
                    <SelectValue placeholder="Toutes les difficultés" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les difficultés</SelectItem>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Advanced Filters Sheet */}
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto h-12 hover:bg-orange-50 border-orange-200">
                      <SlidersHorizontal className="h-5 w-5 mr-2" />
                      Plus de filtres
                      {(selectedIngredients.length > 0 || minRating > 0 || cookTimeRange[0] > 0 || cookTimeRange[1] < 120 || servingsRange[0] > 1 || servingsRange[1] < 10) && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                          !
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Filtres avancés</SheetTitle>
                      <SheetDescription>
                        Affinez votre recherche de recettes
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="space-y-6 mt-6">
                      {/* Cook Time */}
                      <div>
                        <label className="text-sm font-medium">Temps de cuisson (minutes)</label>
                        <div className="mt-2">
                          <Slider
                            value={cookTimeRange}
                            onValueChange={setCookTimeRange}
                            max={120}
                            min={0}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{cookTimeRange[0]}min</span>
                            <span>{cookTimeRange[1]}min</span>
                          </div>
                        </div>
                      </div>

                      {/* Servings */}
                      <div>
                        <label className="text-sm font-medium">Nombre de portions</label>
                        <div className="mt-2">
                          <Slider
                            value={servingsRange}
                            onValueChange={setServingsRange}
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{servingsRange[0]} pers</span>
                            <span>{servingsRange[1]} pers</span>
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="text-sm font-medium">Note minimum</label>
                        <div className="mt-2">
                          <Slider
                            value={[minRating]}
                            onValueChange={(value) => setMinRating(value[0])}
                            max={5}
                            min={0}
                            step={0.5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0⭐</span>
                            <span>{minRating}⭐</span>
                            <span>5⭐</span>
                          </div>
                        </div>
                      </div>

                      {/* Ingredients */}
                      <div>
                        <label className="text-sm font-medium">Ingrédients</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {commonIngredients.map((ingredient) => (
                            <div key={ingredient} className="flex items-center space-x-2">
                              <Checkbox
                                id={ingredient}
                                checked={selectedIngredients.includes(ingredient)}
                                onCheckedChange={(checked) => handleIngredientChange(ingredient, checked as boolean)}
                              />
                              <label htmlFor={ingredient} className="text-sm">{ingredient}</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Clear Filters */}
                      <Button onClick={clearAllFilters} variant="outline" className="w-full">
                        <X className="h-4 w-4 mr-2" />
                        Effacer tous les filtres
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedIngredients.length > 0 || minRating > 0 || searchTerm) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="px-3 py-1">
                  Recherche: "{searchTerm}"
                  <X className="h-3 w-3 ml-2 cursor-pointer" onClick={() => setSearchTerm('')} />
                </Badge>
              )}
              {selectedIngredients.map((ingredient) => (
                <Badge key={ingredient} variant="secondary" className="px-3 py-1">
                  {ingredient}
                  <X className="h-3 w-3 ml-2 cursor-pointer" onClick={() => handleIngredientChange(ingredient, false)} />
                </Badge>
              ))}
              {minRating > 0 && (
                <Badge variant="secondary" className="px-3 py-1">
                  Note ≥ {minRating}⭐
                  <X className="h-3 w-3 ml-2 cursor-pointer" onClick={() => setMinRating(0)} />
                </Badge>
              )}
            </div>
          )}

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
                <span className="font-semibold text-orange-600">{filteredRecipes.length}</span> recette{filteredRecipes.length > 1 ? 's' : ''} trouvée{filteredRecipes.length > 1 ? 's' : ''}
              </p>
            </div>
            <Select defaultValue="popular">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Plus populaires</SelectItem>
                <SelectItem value="recent">Plus récentes</SelectItem>
                <SelectItem value="rating">Mieux notées</SelectItem>
                <SelectItem value="time-asc">Plus rapides</SelectItem>
                <SelectItem value="time-desc">Plus longues</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recipe Grid */}
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="group">
                  <RecipeCard 
                    id={recipe.id}
                    title={recipe.title}
                    image={recipe.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'}
                    cookTime={recipe.cook_time}
                    servings={recipe.servings}
                    difficulty={(recipe.difficulty || 'Moyen') as 'Facile' | 'Moyen' | 'Difficile'}
                    rating={recipe.rating || 0}
                    category={recipe.category}
                    description={recipe.description || ''}
                  />
                </div>
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
                  : "Aucune recette disponible avec ces critères"
                }
              </p>
              <Button onClick={clearAllFilters} className="mt-4" variant="outline">
                Effacer les filtres
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredRecipes.length > 0 && filteredRecipes.length >= 12 && (
            <div className="text-center mt-16">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300">
                <ChefHat className="h-5 w-5 mr-2" />
                Charger plus de recettes
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Recipes;

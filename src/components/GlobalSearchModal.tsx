import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Clock, TrendingUp, X, Play, ChefHat, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { useSupabaseRecipes } from '@/hooks/useSupabaseRecipes';
import { useSupabaseVideos } from '@/hooks/useSupabaseVideos';
import { cn } from '@/lib/utils';

interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchResult = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  type: 'product' | 'recipe' | 'video';
  category?: string;
  price?: number;
  rating?: number;
  duration?: string;
  cookTime?: number;
};

const GlobalSearchModal = ({ open, onOpenChange }: GlobalSearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { data: products = [] } = useSupabaseProducts();
  const { data: recipes = [] } = useSupabaseRecipes();
  const { data: videos = [] } = useSupabaseVideos();

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [open]);

  // Simulate search delay
  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Transform data to unified search results
  const searchResults: SearchResult[] = [
    ...products.map(product => ({
      id: product.id,
      title: product.name,
      description: `${product.price} FCFA - ${product.unit}`,
      image: product.image,
      type: 'product' as const,
      category: product.category,
      price: product.price,
      rating: product.rating || 0
    })),
    ...recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description || '',
      image: recipe.image,
      type: 'recipe' as const,
      category: recipe.category,
      rating: recipe.rating || 0,
      cookTime: recipe.cook_time
    })),
    ...videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description || '',
      image: video.thumbnail,
      type: 'video' as const,
      category: video.category,
      duration: video.duration
    }))
  ];

  // Filter results based on search term and active tab
  const filteredResults = searchResults.filter(result => {
    const matchesSearch = searchTerm === '' || 
      result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || result.type === activeTab;
    
    return matchesSearch && matchesTab;
  }).slice(0, 12); // Limit results

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'product':
        navigate(`/produits/${result.id}`);
        break;
      case 'recipe':
        navigate(`/recettes/${result.id}`);
        break;
      case 'video':
        navigate(`/videos/${result.id}`);
        break;
    }
    onOpenChange(false);
    setSearchTerm('');
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'product': return <ShoppingBag className="h-4 w-4" />;
      case 'recipe': return <ChefHat className="h-4 w-4" />;
      case 'video': return <Play className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product': return 'bg-blue-100 text-blue-700';
      case 'recipe': return 'bg-green-100 text-green-700';
      case 'video': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs = [
    { id: 'all', label: 'Tout', count: searchResults.length },
    { id: 'product', label: 'Produits', count: products.length },
    { id: 'recipe', label: 'Recettes', count: recipes.length },
    { id: 'video', label: 'Vidéos', count: videos.length }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-6 pb-4 border-b">
          <DialogTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-orange-500" />
            <span>Recherche globale</span>
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-4 sm:px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              ref={inputRef}
              placeholder="Rechercher des produits, recettes, vidéos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 h-10 sm:h-12 text-base sm:text-lg border-2 focus:border-orange-500"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                <span>Recherche en cours...</span>
              </div>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="space-y-2 mt-4">
              {filteredResults.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                >
                  {/* Image */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {result.image ? (
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getResultIcon(result.type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                        {result.title}
                      </h3>
                      <Badge className={cn("text-xs", getTypeColor(result.type))}>
                        {result.type === 'product' ? 'Produit' : 
                         result.type === 'recipe' ? 'Recette' : 'Vidéo'}
                      </Badge>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-gray-600 truncate mb-2">
                      {result.description}
                    </p>

                    <div className="flex items-center space-x-2 sm:space-x-4 text-xs text-gray-500">
                      {result.category && (
                        <span className="flex items-center space-x-1">
                          <span>Catégorie:</span>
                          <span className="font-medium">{result.category}</span>
                        </span>
                      )}
                      
                      {result.price && (
                        <span className="font-medium text-orange-600">
                          {result.price} FCFA
                        </span>
                      )}
                      
                      {result.cookTime && (
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{result.cookTime} min</span>
                        </span>
                      )}
                      
                      {result.duration && (
                        <span className="flex items-center space-x-1">
                          <Play className="h-3 w-3" />
                          <span>{result.duration}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier votre recherche ou explorez nos catégories
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Découvrez notre contenu
              </h3>
              <p className="text-gray-600 mb-4">
                Recherchez parmi nos {searchResults.length} produits, recettes et vidéos
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="cursor-pointer hover:bg-orange-50">
                  Plats traditionnels
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-orange-50">
                  Légumes frais
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-orange-50">
                  Tutoriels cuisine
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 sm:px-6 py-3 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="hidden sm:inline">Utilisez ↑↓ pour naviguer, Entrée pour sélectionner</span>
            <span className="sm:hidden">Navigation au toucher</span>
            <span>{filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearchModal;

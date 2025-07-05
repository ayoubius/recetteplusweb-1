
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, ShoppingCart, Plus, Search, Filter } from 'lucide-react';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { useAddToCart } from '@/hooks/useAddToCart';
import { formatCFA } from '@/lib/currency';
import FeaturedCartsCarousel from '@/components/FeaturedCartsCarousel';

const Products = () => {
  const { data: products = [], isLoading, error } = useSupabaseProducts();
  const { addToCart, isAdding } = useAddToCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  console.log('Products data:', products);
  console.log('Products loading:', isLoading);
  console.log('Products error:', error);

  // Filtrage et tri des produits
  const filteredProducts = products
    .filter(product => {
      if (!product) return false;
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory && product.in_stock;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      switch (sortBy) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

  // Obtenir les catégories uniques
  const categories = Array.from(new Set(products.filter(p => p?.category).map(product => product.category)));

  const handleAddToCart = async (productId: string) => {
    if (!productId) return;
    await addToCart(productId, 1);
  };

  if (error) {
    console.error('Error loading products:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
              <p className="text-gray-600">
                Impossible de charger les produits. Veuillez réessayer plus tard.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Nos Produits
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre sélection de produits frais et de qualité
          </p>
        </div>

        {/* Paniers préconfigurés en vedette */}
        <FeaturedCartsCarousel />

        {/* Filtres */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category || 'unknown'}>
                      {category || 'Catégorie inconnue'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nom A-Z</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  <SelectItem value="rating">Meilleures notes</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center text-sm text-gray-600">
                <Filter className="h-4 w-4 mr-2" />
                {filteredProducts.length} produit(s)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grille de produits */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-600">
                {products.length === 0 
                  ? "Aucun produit n'est disponible pour le moment."
                  : "Essayez de modifier vos critères de recherche ou de filtrage."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={product.image || '/placeholder.svg'} 
                    alt={product.name || 'Produit'}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.promotion && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white">
                        -20%
                      </Badge>
                    </div>
                  )}
                  {!product.in_stock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="destructive">Rupture de stock</Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category || 'Non classé'}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name || 'Produit sans nom'}
                  </h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < (product.rating || 0) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.rating || 0})
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold text-orange-500">
                        {formatCFA(product.price || 0)}
                      </span>
                      <p className="text-xs text-gray-500">par {product.unit || 'unité'}</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={!product.in_stock || isAdding}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
                  >
                    {isAdding ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    {product.in_stock ? 'Ajouter au panier' : 'Indisponible'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;


import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, Heart, Star, Package, Truck } from 'lucide-react';
import { formatCFA } from '@/lib/currency';
import { usePersonalCart } from '@/hooks/useSupabaseCart';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import FavoriteButton from '@/components/FavoriteButton';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: products = [] } = useSupabaseProducts();
  const { addToPersonalCart, isAdding } = usePersonalCart();
  const { currentUser } = useAuth();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Produit non trouvé</h2>
          <Button onClick={() => navigate('/produits')} className="bg-orange-500 hover:bg-orange-600">
            Retour aux produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/produits')}
          className="mb-6 hover:bg-white/80"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux produits
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <img 
                src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {product.category}
                </Badge>
                <FavoriteButton 
                  itemId={product.id} 
                  type="product"
                  className="bg-white hover:bg-gray-50"
                />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    ({product.rating?.toFixed(1) || '0.0'})
                  </span>
                </div>
                <Badge 
                  variant={product.in_stock ? "default" : "destructive"}
                  className={product.in_stock ? "bg-green-100 text-green-700" : ""}
                >
                  {product.in_stock ? "En stock" : "Rupture de stock"}
                </Badge>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-orange-600">
                    {formatCFA(product.price)}
                  </span>
                  <span className="text-lg text-gray-500">/ {product.unit}</span>
                </div>
                {product.promotion && (
                  <div className="mt-2">
                    <span className="text-lg text-gray-500 line-through mr-2">
                      {formatCFA(product.promotion.originalPrice)}
                    </span>
                    <Badge variant="destructive">
                      -{product.promotion.discount}%
                    </Badge>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg font-semibold"
                  disabled={!product.in_stock || isAdding}
                  onClick={() => {
                    if (!currentUser) {
                      navigate('/login');
                      return;
                    }
                    addToPersonalCart({ productId: product.id, quantity: 1 });
                  }}
                >
                  {isAdding ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  ) : (
                    <ShoppingCart className="h-5 w-5 mr-2" />
                  )}
                  {isAdding ? 'Ajout en cours...' : 'Ajouter au panier'}
                </Button>
              </div>
            </div>

            {/* Product Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Unité de vente</h3>
                  <p className="text-gray-600">{product.unit}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Truck className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Livraison</h3>
                  <p className="text-gray-600">24-48h</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

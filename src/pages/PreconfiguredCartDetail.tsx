
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Package, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePreconfiguredCarts } from '@/hooks/useSupabaseCart';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { formatCFA } from '@/lib/currency';

const PreconfiguredCartDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addPreconfiguredCartToPersonal, isAdding } = usePreconfiguredCarts();
  const { currentUser } = useAuth();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['preconfigured-cart', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preconfigured_carts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['preconfigured-cart-products', cart?.items],
    queryFn: async () => {
      if (!cart?.items) return [];
      
      const items = cart.items as Array<{productId: string, quantity: number}>;
      const productIds = items.map(item => item.productId);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (error) throw error;
      
      return data?.map(product => {
        const item = items.find(i => i.productId === product.id);
        return {
          ...product,
          quantity: item?.quantity || 1
        };
      }) || [];
    },
    enabled: !!cart?.items,
  });

  const handleAddToCart = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (cart) {
      addPreconfiguredCartToPersonal(cart.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Panier non trouvé</h2>
          <Button onClick={() => navigate('/paniers-preconfigures')} className="bg-orange-500 hover:bg-orange-600">
            Retour aux paniers
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
          onClick={() => navigate('/paniers-preconfigures')}
          className="mb-6 hover:bg-white/80"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux paniers
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image et infos principales */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={cart.image || '/placeholder.svg'} 
                  alt={cart.name}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-orange-500 text-white">
                    Panier Préconfiguré
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{cart.category}</Badge>
                  {cart.is_featured && (
                    <Badge className="bg-yellow-500 text-white">En vedette</Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{cart.name}</h1>
                
                {cart.description && (
                  <p className="text-gray-700 leading-relaxed mb-6">{cart.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-orange-500">
                    {formatCFA(cart.total_price || 0)}
                  </div>
                  
                  <Button 
                    onClick={handleAddToCart}
                    disabled={isAdding || !currentUser}
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {isAdding ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <ShoppingCart className="h-5 w-5 mr-2" />
                    )}
                    {isAdding ? 'Ajout...' : 'Ajouter au panier'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Produits inclus */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Produits inclus ({products.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={product.image || '/placeholder.svg'} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          Quantité: {product.quantity} {product.unit}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{product.category}</Badge>
                          <span className="text-orange-500 font-semibold">
                            {formatCFA(product.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Informations */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Produits</span>
                  <span>{products.length} articles</span>
                </div>
                <div className="flex justify-between">
                  <span>Catégorie</span>
                  <span>{cart.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prix total</span>
                  <span className="font-bold text-orange-500">
                    {formatCFA(cart.total_price || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {!currentUser && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-600 mb-4">
                    Connectez-vous pour ajouter ce panier
                  </p>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Se connecter
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreconfiguredCartDetail;

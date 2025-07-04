
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Package, Edit, Trash2, Star } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { useSupabaseProducts, useCreateSupabaseProduct, useUpdateSupabaseProduct, useDeleteSupabaseProduct, SupabaseProduct } from '@/hooks/useSupabaseProducts';
import { formatPrice } from '@/lib/currency';

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SupabaseProduct | null>(null);
  
  const { data: products = [], isLoading, refetch } = useSupabaseProducts();
  const createMutation = useCreateSupabaseProduct();
  const updateMutation = useUpdateSupabaseProduct();
  const deleteMutation = useDeleteSupabaseProduct();

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (data: Omit<SupabaseProduct, 'id' | 'created_at'>) => {
    await createMutation.mutateAsync(data);
    setShowForm(false);
    refetch();
  };

  const handleUpdate = async (data: Omit<SupabaseProduct, 'id' | 'created_at'>) => {
    if (!editingProduct) return;
    
    await updateMutation.mutateAsync({
      id: editingProduct.id,
      data
    });
    setEditingProduct(null);
    refetch();
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Supprimer le produit "${name}" ?`)) {
      await deleteMutation.mutateAsync(id);
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <Package className="h-6 w-6 mr-2 text-orange-500" />
              Produits
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {products.length} produits au total
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} size="sm" className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:block p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="h-8 w-8 mr-3 text-orange-500" />
              Produits ({products.length})
            </h1>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Button>
        </div>
      </div>

      <div className="p-4 lg:px-6 space-y-4 lg:space-y-6">
        {/* Search */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Grid - Mobile */}
        <div className="lg:hidden space-y-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="shadow-sm border">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg text-green-600">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-gray-500">/ {product.unit}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {product.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm">{product.rating}</span>
                          </div>
                        )}
                        <Badge variant={product.in_stock ? "default" : "destructive"}>
                          {product.in_stock ? "En stock" : "Rupture"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products Grid - Desktop */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <img 
                  src={product.image || '/placeholder.svg'} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={product.in_stock ? "default" : "destructive"}>
                    {product.in_stock ? "En stock" : "Rupture"}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-bold text-xl text-green-600">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">/ {product.unit}</span>
                  </div>
                  {product.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{product.rating}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(product.id, product.name)}
                    className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Aucun produit trouvé' : 'Aucun produit'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Commencez par créer votre premier produit'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau produit</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={handleUpdate}
              onCancel={() => setEditingProduct(null)}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, Star, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProductForm from '@/components/admin/ProductForm';
import { useSupabaseProducts, useCreateSupabaseProduct, useUpdateSupabaseProduct, useDeleteSupabaseProduct, SupabaseProduct } from '@/hooks/useSupabaseProducts';

// Fonction utilitaire pour formater le prix
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SupabaseProduct | null>(null);
  
  const { toast } = useToast();
  
  const { data: products = [], isLoading: productsLoading, refetch } = useSupabaseProducts();
  const createProductMutation = useCreateSupabaseProduct();
  const updateProductMutation = useUpdateSupabaseProduct();
  const deleteProductMutation = useDeleteSupabaseProduct();

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreate = async (data: Omit<SupabaseProduct, 'id' | 'created_at'>) => {
    try {
      console.log('Creating product with data:', data);
      await createProductMutation.mutateAsync(data);
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdate = async (data: Omit<SupabaseProduct, 'id' | 'created_at'>) => {
    if (!editingProduct) return;
    
    try {
      console.log('Updating product with data:', data);
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        data
      });
      setEditingProduct(null);
      refetch();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${name}" ?`)) {
      try {
        await deleteProductMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const isLoading = productsLoading;
  const isMutating = createProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="h-8 w-8 mr-3 text-orange-500" />
            Gestion des produits
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez tous les produits de votre boutique ({products.length} produits)
          </p>
        </div>
        <Button 
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Produits ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.unit}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{formatPrice(product.price)}</p>
                      {product.promotion && (
                        <p className="text-sm text-red-500 line-through">
                          {formatPrice(product.promotion.originalPrice)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                      {product.in_stock ? 'En stock' : 'Rupture'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{product.rating || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingProduct(product)}
                        disabled={isMutating}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={isMutating}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un produit</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isLoading={createProductMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct as any}
              onSubmit={handleUpdate}
              onCancel={() => setEditingProduct(null)}
              isLoading={updateProductMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;

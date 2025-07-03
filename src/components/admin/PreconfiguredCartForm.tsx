
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { PreconfiguredCart } from '@/hooks/usePreconfiguredCarts';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import FileUploadField from './FileUploadField';
import { useSupabaseUpload } from '@/hooks/useSupabaseUpload';

interface PreconfiguredCartFormProps {
  cart?: PreconfiguredCart;
  onSubmit: (data: Omit<PreconfiguredCart, 'id' | 'created_at'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const categories = [
  'Général', 'Petit-déjeuner', 'Déjeuner', 'Dîner', 'Apéritif', 
  'Dessert', 'Végétarien', 'Végan', 'Sans gluten', 'Occasion spéciale'
];

const PreconfiguredCartForm: React.FC<PreconfiguredCartFormProps> = ({
  cart,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const { data: products = [] } = useSupabaseProducts();
  const { uploadFile, uploading, uploadProgress } = useSupabaseUpload();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: cart?.name || '',
    description: cart?.description || '',
    image: cart?.image || '',
    category: cart?.category || 'Général',
    is_active: cart?.is_active ?? true,
    is_featured: cart?.is_featured ?? false,
    items: cart?.items || [],
    total_price: cart?.total_price || 0
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
    calculateTotalPrice(newItems);
  };

  const updateItem = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    const newItems = formData.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, items: newItems });
    calculateTotalPrice(newItems);
  };

  const calculateTotalPrice = (items: any[]) => {
    const total = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    setFormData(prev => ({ ...prev, total_price: total }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = formData.image;
    
    if (selectedImageFile) {
      const uploadedUrl = await uploadFile(selectedImageFile, 'paniers-preconfigures');
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    const cleanData = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      image: imageUrl || null,
      category: formData.category,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      items: formData.items.filter(item => item.productId && item.quantity > 0),
      total_price: formData.total_price
    };

    onSubmit(cleanData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          {cart ? 'Modifier le panier préconfiguré' : 'Créer un panier préconfiguré'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom du panier *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <FileUploadField
            label="Image du panier"
            value={formData.image}
            onChange={(url) => setFormData({...formData, image: url})}
            onFileSelect={setSelectedImageFile}
            acceptedTypes="image/*"
            uploading={uploading}
            uploadProgress={uploadProgress}
            placeholder="https://exemple.com/image.jpg"
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Produits du panier</Label>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un produit
              </Button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-4 items-end p-4 border rounded-lg">
                <div className="flex-1">
                  <Label>Produit</Label>
                  <Select 
                    value={item.productId} 
                    onValueChange={(value) => updateItem(index, 'productId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {product.price}€/{product.unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24">
                  <Label>Quantité</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-lg font-semibold">
              Prix total: {formData.total_price.toFixed(2)}€
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Panier actif</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
              />
              <Label htmlFor="is_featured">Panier en vedette</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={uploading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || uploading}>
              {uploading ? 'Upload en cours...' : isLoading ? 'Enregistrement...' : (cart ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PreconfiguredCartForm;

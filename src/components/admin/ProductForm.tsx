
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SupabaseProduct } from '@/hooks/useSupabaseProducts';

interface ProductFormProps {
  product?: SupabaseProduct;
  onSubmit: (data: Omit<SupabaseProduct, 'id' | 'created_at'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const categories = [
  'Légumes', 'Fruits', 'Viandes', 'Poissons', 'Produits laitiers', 
  'Céréales', 'Légumineuses', 'Épices', 'Condiments', 'Boissons'
];

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    image: product?.image || '',
    price: product?.price || 0,
    unit: product?.unit || '',
    category: product?.category || '',
    rating: product?.rating || 4.0,
    in_stock: product?.in_stock ?? true,
    promotion: product?.promotion || null
  });

  const [hasPromotion, setHasPromotion] = useState(!!product?.promotion);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanData: Omit<SupabaseProduct, 'id' | 'created_at'> = {
      name: formData.name,
      image: formData.image || null,
      price: formData.price,
      unit: formData.unit,
      category: formData.category,
      rating: formData.rating || null,
      in_stock: formData.in_stock,
      promotion: hasPromotion && formData.promotion ? formData.promotion : null
    };

    onSubmit(cleanData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? 'Modifier le produit' : 'Ajouter un produit'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom du produit *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Catégorie *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
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
            <Label htmlFor="image">URL de l'image</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="https://exemple.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Prix (€) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                required
              />
            </div>
            <div>
              <Label htmlFor="unit">Unité *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                placeholder="ex: kg, pièce, litre"
                required
              />
            </div>
            <div>
              <Label htmlFor="rating">Note</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating || ''}
                onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value) || null})}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="in_stock"
              checked={formData.in_stock}
              onCheckedChange={(checked) => setFormData({...formData, in_stock: checked})}
            />
            <Label htmlFor="in_stock">En stock</Label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="hasPromotion"
                checked={hasPromotion}
                onCheckedChange={setHasPromotion}
              />
              <Label htmlFor="hasPromotion">En promotion</Label>
            </div>

            {hasPromotion && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                <div>
                  <Label htmlFor="discount">Remise (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.promotion?.discount || 0}
                    onChange={(e) => setFormData({
                      ...formData, 
                      promotion: {
                        discount: parseInt(e.target.value) || 0,
                        originalPrice: formData.promotion?.originalPrice || formData.price
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Prix original (€)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.promotion?.originalPrice || formData.price}
                    onChange={(e) => setFormData({
                      ...formData, 
                      promotion: {
                        discount: formData.promotion?.discount || 0,
                        originalPrice: parseFloat(e.target.value) || formData.price
                      }
                    })}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : (product ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;

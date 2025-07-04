import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Trash2, Package, Calculator } from 'lucide-react';
import { PreconfiguredCart } from '@/hooks/usePreconfiguredCarts';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import FileUploadField from './FileUploadField';
import { useSupabaseUpload } from '@/hooks/useSupabaseUpload';
import { useToast } from '@/hooks/use-toast';

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
  const { data: products = [], isLoading: productsLoading } = useSupabaseProducts();
  const { uploadFile, uploading, uploadProgress } = useSupabaseUpload();
  const { toast } = useToast();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    category: 'Général',
    is_active: true,
    is_featured: false,
    items: [] as Array<{ productId: string; quantity: number }>,
    total_price: 0
  });

  // Fonction pour vérifier si un objet a la structure d'un item de panier
  const isValidCartItem = (item: any): item is { productId: string; quantity: number } => {
    return item && 
           typeof item === 'object' && 
           typeof item.productId === 'string' && 
           typeof item.quantity === 'number' &&
           item.productId.length > 0 &&
           item.quantity > 0;
  };

  // Fonction pour normaliser les items en tableau
  const normalizeItems = (items: any): Array<{ productId: string; quantity: number }> => {
    if (!items) return [];
    if (Array.isArray(items)) {
      return items.filter(isValidCartItem);
    }
    if (typeof items === 'object') {
      try {
        const values = Object.values(items);
        return values.filter(isValidCartItem);
      } catch (error) {
        console.warn('Erreur lors de la normalisation des items:', error);
        return [];
      }
    }
    return [];
  };

  // Initialiser le formulaire avec les données du panier si fourni
  useEffect(() => {
    if (cart) {
      console.log('Cart data received:', cart);
      const normalizedItems = normalizeItems(cart.items);
      console.log('Normalized items:', normalizedItems);
      
      setFormData({
        name: cart.name || '',
        description: cart.description || '',
        image: cart.image || '',
        category: cart.category || 'Général',
        is_active: cart.is_active ?? true,
        is_featured: cart.is_featured ?? false,
        items: normalizedItems,
        total_price: cart.total_price || 0
      });
    }
  }, [cart]);

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1 }]
    }));
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
    calculateTotalPrice(newItems);
  };

  const updateItem = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    const newItems = formData.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData(prev => ({ ...prev, items: newItems }));
    calculateTotalPrice(newItems);
  };

  const calculateTotalPrice = (items: Array<{ productId: string; quantity: number }>) => {
    const total = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    setFormData(prev => ({ ...prev, total_price: total }));
  };

  // Recalculer le prix total quand les items changent
  useEffect(() => {
    if (formData.items.length > 0) {
      calculateTotalPrice(formData.items);
    }
  }, [formData.items, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du panier est requis",
        variant: "destructive"
      });
      return;
    }

    if (formData.items.length === 0) {
      toast({
        title: "Erreur",
        description: "Ajoutez au moins un produit au panier",
        variant: "destructive"
      });
      return;
    }

    const invalidItems = formData.items.filter(item => !item.productId || item.quantity <= 0);
    if (invalidItems.length > 0) {
      toast({
        title: "Erreur",
        description: "Tous les produits doivent avoir un nom et une quantité valide",
        variant: "destructive"
      });
      return;
    }
    
    let imageUrl = formData.image;
    
    if (selectedImageFile) {
      try {
        const uploadedUrl = await uploadFile(selectedImageFile, 'paniers-preconfigures');
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'uploader l'image",
          variant: "destructive"
        });
        return;
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

    console.log('Submitting cart data:', cleanData);
    onSubmit(cleanData);
  };

  const getProductPrice = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.price : 0;
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardTitle className="flex items-center text-2xl">
            <ShoppingCart className="h-6 w-6 mr-3" />
            {cart ? 'Modifier le panier préconfiguré' : 'Créer un panier préconfiguré'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Nom du panier *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  placeholder="Ex: Panier petit-déjeuner"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-sm font-medium">
                  Catégorie
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}
                >
                  <SelectTrigger className="mt-1">
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
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                placeholder="Décrivez le contenu et l'usage de ce panier..."
                rows={3}
                className="mt-1"
              />
            </div>

            <FileUploadField
              label="Image du panier"
              value={formData.image}
              onChange={(url) => setFormData(prev => ({...prev, image: url}))}
              onFileSelect={setSelectedImageFile}
              acceptedTypes="image/*"
              uploading={uploading}
              uploadProgress={uploadProgress}
              placeholder="https://exemple.com/image.jpg"
            />

            {/* Produits du panier */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Produits du panier *
                </Label>
                <Button type="button" onClick={addItem} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter un produit
                </Button>
              </div>

              {formData.items.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Aucun produit ajouté</p>
                  <Button type="button" onClick={addItem} size="sm" className="mt-2">
                    Ajouter le premier produit
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <Card key={index} className="p-4 border border-gray-200">
                      <div className="flex gap-4 items-start">
                        <div className="flex-1">
                          <Label className="text-sm font-medium">Produit</Label>
                          <Select 
                            value={item.productId} 
                            onValueChange={(value) => updateItem(index, 'productId', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Sélectionner un produit" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} - {product.price} FCFA/{product.unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-24">
                          <Label className="text-sm font-medium">Quantité</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="mt-1"
                          />
                        </div>
                        <div className="w-24">
                          <Label className="text-sm font-medium">Prix</Label>
                          <div className="mt-1 p-2 bg-gray-50 rounded text-sm font-medium">
                            {(getProductPrice(item.productId) * item.quantity).toLocaleString()} FCFA
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="mt-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Prix total */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-green-600" />
                    <span className="text-lg font-semibold text-green-800">Prix total du panier</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formData.total_price.toLocaleString()} FCFA
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="flex items-center space-x-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({...prev, is_active: checked}))}
                />
                <Label htmlFor="is_active" className="font-medium">
                  Panier actif
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({...prev, is_featured: checked}))}
                />
                <Label htmlFor="is_featured" className="font-medium">
                  Panier en vedette
                </Label>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                disabled={uploading || isLoading}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || uploading || formData.items.length === 0}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {uploading ? 'Upload en cours...' : 
                 isLoading ? 'Enregistrement...' : 
                 cart ? 'Modifier le panier' : 'Créer le panier'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreconfiguredCartForm;

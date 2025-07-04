import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, ShoppingCart, MapPin } from 'lucide-react';
import QRCode from 'qrcode';

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
}

interface CreateOrderDialogProps {
  children: React.ReactNode;
}

const CreateOrderDialog: React.FC<CreateOrderDialogProps> = ({ children }) => {
  const { data: products = [] } = useSupabaseProducts();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    postal_code: '',
    country: 'France'
  });
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const generateQRCode = async (orderId: string): Promise<string> => {
    try {
      const qrData = JSON.stringify({
        orderId: orderId,
        timestamp: new Date().toISOString(),
        amount: calculateTotal()
      });
      
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  };

  const addToOrder = (product: any) => {
    const existingItem = orderItems.find(item => item.product_id === product.id);
    if (existingItem) {
      setOrderItems(items => 
        items.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems(items => [...items, {
        product_id: product.id,
        quantity: 1,
        price: product.price,
        name: product.name
      }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(items => items.filter(item => item.product_id !== productId));
    } else {
      setOrderItems(items => 
        items.map(item => 
          item.product_id === productId 
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCreateOrder = async () => {
    if (!currentUser || orderItems.length === 0) return;
    
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.postal_code) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs d'adresse de livraison.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: currentUser.id,
          total_amount: calculateTotal(),
          items: orderItems as any,
          delivery_address: deliveryAddress as any,
          delivery_notes: deliveryNotes || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      const qrCodeDataURL = await generateQRCode(data.id);
      
      if (qrCodeDataURL) {
        await supabase
          .from('orders')
          .update({ 
            qr_code: `QR_${data.id.slice(0, 8)}_${Date.now()}` 
          })
          .eq('id', data.id);
      }

      toast({
        title: "Commande créée",
        description: `Commande #${data.id.slice(0, 8)} créée avec succès. Paiement à la réception.`
      });

      // Reset form
      setOrderItems([]);
      setDeliveryAddress({
        street: '',
        city: '',
        postal_code: '',
        country: 'France'
      });
      setDeliveryNotes('');
      setOpen(false);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Créer une Commande</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sélection des produits */}
          <div className="space-y-4">
            <h3 className="font-semibold">Sélectionner les produits</h3>
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-sm font-semibold text-orange-600">
                          {formatPrice(product.price)} / {product.unit}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addToOrder(product)}
                        disabled={!product.in_stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Panier et adresse */}
          <div className="space-y-4">
            {/* Panier */}
            <div>
              <h3 className="font-semibold mb-3">Panier ({orderItems.length} articles)</h3>
              {orderItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucun produit sélectionné</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {orderItems.map((item) => (
                    <div key={item.product_id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">{formatPrice(item.price)} chacun</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="ml-4 text-sm font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {orderItems.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span className="text-lg text-orange-600">{formatPrice(calculateTotal())}</span>
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    Paiement à la réception
                  </Badge>
                  {/* Orange Money bientôt disponible */}
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-800">🧡 Orange Money</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                        Bientôt disponible
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Adresse de livraison */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Adresse de livraison</span>
              </h3>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="street">Rue</Label>
                  <Input
                    id="street"
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, street: e.target.value})}
                    placeholder="123 Rue de la Paix"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                      placeholder="Paris"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal_code">Code postal</Label>
                    <Input
                      id="postal_code"
                      value={deliveryAddress.postal_code}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, postal_code: e.target.value})}
                      placeholder="75001"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes de livraison (optionnel)</Label>
                  <Textarea
                    id="notes"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Instructions spéciales pour la livraison..."
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Bouton de création */}
            <Button
              onClick={handleCreateOrder}
              disabled={orderItems.length === 0 || isCreating}
              className="w-full"
            >
              {isCreating ? 'Création...' : `Créer la commande - ${formatPrice(calculateTotal())}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderDialog;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Package, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { formatCFA, DELIVERY_FEE } from '@/lib/currency';
import LocationPicker from '@/components/LocationPicker';
import QRCode from 'qrcode';

interface SimpleOrderFormProps {
  cartItems: any[];
  subtotal: number;
  onOrderComplete: () => void;
}

const SimpleOrderForm: React.FC<SimpleOrderFormProps> = ({ 
  cartItems, 
  subtotal, 
  onOrderComplete 
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [notes, setNotes] = useState('');

  const total = subtotal + DELIVERY_FEE;

  const handleLocationSelect = (latitude: number, longitude: number) => {
    setLocation({ latitude, longitude });
  };

  const generateQRCode = async (orderId: string): Promise<string> => {
    try {
      const qrData = JSON.stringify({
        orderId: orderId,
        timestamp: new Date().toISOString(),
        amount: total
      });
      
      return await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (error) {
      console.error('Erreur génération QR code:', error);
      return '';
    }
  };

  const clearAllCarts = async () => {
    try {
      console.log('Nettoyage des paniers...');
      
      const { data: personalCart } = await supabase
        .from('personal_carts')
        .select('id')
        .eq('user_id', currentUser?.id)
        .maybeSingle();

      if (personalCart) {
        await supabase
          .from('personal_cart_items')
          .delete()
          .eq('personal_cart_id', personalCart.id);
        
        console.log('Panier personnel nettoyé');
      }

      const { data: recipeCarts } = await supabase
        .from('recipe_user_carts')
        .select('id')
        .eq('user_id', currentUser?.id);

      if (recipeCarts && recipeCarts.length > 0) {
        const recipeCartIds = recipeCarts.map(cart => cart.id);
        
        await supabase
          .from('recipe_cart_items')
          .delete()
          .in('recipe_cart_id', recipeCartIds);

        await supabase
          .from('recipe_user_carts')
          .delete()
          .in('id', recipeCartIds);
        
        console.log('Paniers recettes nettoyés');
      }

      await supabase
        .from('user_preconfigured_carts')
        .delete()
        .eq('user_id', currentUser?.id);
      
      console.log('Paniers préconfigurés nettoyés');
      console.log('Tous les paniers ont été nettoyés avec succès');

    } catch (error) {
      console.error('Erreur lors du nettoyage des paniers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location) {
      toast({
        title: "Position requise",
        description: "Veuillez autoriser l'accès à votre position pour continuer.",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Panier vide",
        description: "Votre panier est vide. Ajoutez des produits avant de commander.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Création de la commande...');
      
      // Préparer les items avec des informations complètes
      const orderItems = cartItems.map(item => ({
        product_id: item.product_id || item.id,
        quantity: item.quantity,
        price: item.products?.price || item.price || item.unit_price || 0,
        name: item.products?.name || item.name || item.product_name || 'Produit'
      }));

      console.log('Items de commande préparés:', orderItems);
      
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: currentUser?.id,
          items: orderItems,
          total_amount: total,
          delivery_fee: DELIVERY_FEE,
          delivery_latitude: location.latitude.toString(),
          delivery_longitude: location.longitude.toString(),
          delivery_notes: notes,
          delivery_address: {
            street: "Position GPS",
            city: "À définir par GPS",
            postal_code: "00000",
            country: "Burkina Faso"
          },
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur création commande:', error);
        throw error;
      }

      console.log('Commande créée:', order);

      const qrCodeDataURL = await generateQRCode(order.id);
      
      if (qrCodeDataURL) {
        await supabase
          .from('orders')
          .update({ 
            qr_code: `QR_${order.id.slice(0, 8)}_${Date.now()}` 
          })
          .eq('id', order.id);
      }

      await clearAllCarts();

      toast({
        title: "Commande créée avec succès !",
        description: `Commande #${order.id.slice(0, 8)} - Paiement à la livraison`,
        duration: 5000
      });

      onOrderComplete();
      
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <LocationPicker 
        onLocationSelect={handleLocationSelect}
        selectedLocation={location}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Finaliser la commande
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Méthode de paiement */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Méthode de paiement
              </Label>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 border-2 border-orange-500 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Paiement à la livraison</p>
                      <p className="text-sm text-gray-600">Espèces uniquement</p>
                    </div>
                  </div>
                </div>
                
                {/* Orange Money bientôt disponible */}
                <div className="p-4 border-2 border-gray-200 bg-gray-50 rounded-lg opacity-75">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-5 w-5 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-700">Orange Money</p>
                        <p className="text-sm text-gray-500">Paiement mobile sécurisé</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Bientôt disponible
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes de livraison */}
            <div>
              <Label htmlFor="notes">Notes pour la livraison (optionnel)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Instructions spéciales, point de repère, etc."
                rows={3}
              />
            </div>

            {/* Résumé de la commande */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Résumé de la commande
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Sous-total ({cartItems.length} articles)</span>
                  <span>{formatCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span>{formatCFA(DELIVERY_FEE)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-500">{formatCFA(total)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-3">
                <CreditCard className="h-4 w-4 text-green-500" />
                <p className="text-sm text-gray-600">
                  Paiement à la livraison en espèces
                </p>
              </div>
            </div>

            {/* Bouton de commande */}
            <Button
              type="submit"
              disabled={isSubmitting || !location || cartItems.length === 0}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Création en cours...
                </div>
              ) : (
                <div className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Confirmer la commande - {formatCFA(total)}
                </div>
              )}
            </Button>
            
            {(!location || cartItems.length === 0) && (
              <div className="text-center text-sm text-gray-500">
                {!location && "📍 Veuillez autoriser l'accès à votre position"}
                {cartItems.length === 0 && "🛒 Votre panier est vide"}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleOrderForm;

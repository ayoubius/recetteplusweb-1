
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Package, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { formatCFA, DELIVERY_FEE } from '@/lib/currency';
import LocationPicker from '@/components/LocationPicker';

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

    setIsSubmitting(true);

    try {
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: currentUser?.id,
          items: cartItems.map(item => ({
            product_id: item.product_id || item.id,
            quantity: item.quantity,
            price: item.products?.price || item.price,
            name: item.products?.name || item.name
          })),
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

      if (error) throw error;

      // Vider le panier après commande réussie
      if (cartItems.length > 0) {
        const itemIds = cartItems.map(item => item.id);
        await supabase
          .from('personal_cart_items')
          .delete()
          .in('id', itemIds);
      }

      toast({
        title: "Commande créée avec succès !",
        description: `Commande #${order.id.slice(0, 8)} - Paiement à la livraison`
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
            Détails de la commande
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
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
              <p className="text-sm text-gray-600 mt-2">
                💰 Paiement à la livraison en espèces
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !location}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              ) : (
                <CreditCard className="h-5 w-5 mr-2" />
              )}
              {isSubmitting ? 'Création en cours...' : `Commander ${formatCFA(total)}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleOrderForm;

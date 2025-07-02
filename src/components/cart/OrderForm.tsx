
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Package, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { formatCFA, DELIVERY_FEE } from '@/lib/currency';

interface OrderFormProps {
  cartItems: any[];
  subtotal: number;
  onOrderComplete: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ cartItems, subtotal, onOrderComplete }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    notes: ''
  });

  const total = subtotal + DELIVERY_FEE;

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          toast({
            title: "Position obtenue",
            description: "Votre position a été ajoutée à la commande."
          });
        },
        (error) => {
          toast({
            title: "Erreur de géolocalisation",
            description: "Impossible d'obtenir votre position. Veuillez saisir manuellement.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      toast({
        title: "Position requise",
        description: "Veuillez fournir votre position pour la livraison.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer la commande
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
          delivery_latitude: formData.latitude,
          delivery_longitude: formData.longitude,
          delivery_notes: formData.notes,
          delivery_address: {
            street: "Position GPS",
            city: "À définir",
            postal_code: "00000",
            country: "Burkina Faso"
          },
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Commande créée",
        description: "Votre commande a été créée avec succès. Paiement à la livraison."
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Finaliser la commande
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Position de livraison */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Position de livraison</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                  placeholder="Ex: 12.3714"
                  required
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                  placeholder="Ex: -1.5197"
                  required
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleLocationRequest}
              className="w-full"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Utiliser ma position actuelle
            </Button>
          </div>

          {/* Notes de livraison */}
          <div>
            <Label htmlFor="notes">Notes de livraison (optionnel)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Instructions spéciales, point de repère, etc."
              rows={3}
            />
          </div>

          {/* Résumé de la commande */}
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

          {/* Bouton de commande */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            ) : (
              <CreditCard className="h-5 w-5 mr-2" />
            )}
            {isSubmitting ? 'Création en cours...' : `Commander pour ${formatCFA(total)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderForm;

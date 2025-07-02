
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DeliveryTracking {
  id: string;
  order_id: string;
  delivery_person_id: string;
  latitude?: number;
  longitude?: number;
  status: string;
  notes?: string;
  created_at: string;
}

export const useDeliveryTracking = (orderId?: string) => {
  return useQuery({
    queryKey: ['delivery-tracking', orderId],
    queryFn: async () => {
      if (!orderId) return [];
      
      const { data, error } = await supabase
        .from('delivery_tracking')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as DeliveryTracking[];
    },
    enabled: !!orderId,
    refetchInterval: 10000, // Actualiser toutes les 10 secondes
  });
};

export const useUpdateDeliveryLocation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      orderId, 
      latitude, 
      longitude, 
      status, 
      notes 
    }: { 
      orderId: string; 
      latitude: number; 
      longitude: number; 
      status: string; 
      notes?: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('delivery_tracking')
        .insert({
          order_id: orderId,
          delivery_person_id: user.user.id,
          latitude,
          longitude,
          status,
          notes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['delivery-tracking', variables.orderId] });
    },
    onError: (error) => {
      console.error('Error updating delivery location:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la localisation.",
        variant: "destructive"
      });
    }
  });
};

export const useAssignOrderToDelivery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orderId, qrCode }: { orderId: string; qrCode: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Non authentifié');

      // Vérifier que le code QR correspond à la commande
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('qr_code', qrCode)
        .single();

      if (orderError || !order) {
        throw new Error('Code QR invalide ou commande non trouvée');
      }

      if (order.status !== 'validated') {
        throw new Error('Cette commande n\'est pas encore validée');
      }

      // Assigner la commande au livreur
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'assigned',
          assigned_to: user.user.id,
          assigned_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Commande assignée",
        description: "La commande vous a été assignée avec succès."
      });
    },
    onError: (error: any) => {
      console.error('Error assigning order:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'assigner la commande.",
        variant: "destructive"
      });
    }
  });
};

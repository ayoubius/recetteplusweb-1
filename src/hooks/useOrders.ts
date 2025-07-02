
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'validated' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  total_amount: number;
  items: any[];
  delivery_address: any;
  validated_by?: string;
  validated_at?: string;
  assigned_to?: string;
  assigned_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  qr_code?: string;
  delivery_notes?: string;
  delivery_fee?: number;
  delivery_latitude?: string;
  delivery_longitude?: string;
  delivery_zone_id?: string;
  google_maps_link?: string;
  created_at: string;
  updated_at: string;
}

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });
};

export const useUserOrders = (userId?: string) => {
  return useQuery({
    queryKey: ['user-orders', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
    enabled: !!userId,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orderId, status, deliveryPersonId }: { 
      orderId: string; 
      status: Order['status']; 
      deliveryPersonId?: string;
    }) => {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'assigned' && deliveryPersonId) {
        updateData.assigned_to = deliveryPersonId;
        updateData.assigned_at = new Date().toISOString();
      } else if (status === 'picked_up') {
        updateData.picked_up_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été modifié avec succès."
      });
    },
    onError: (error) => {
      console.error('Error updating order status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande.",
        variant: "destructive"
      });
    }
  });
};

export const useValidateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'validated',
          validated_by: (await supabase.auth.getUser()).data.user?.id,
          validated_at: new Date().toISOString(),
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
        title: "Commande validée",
        description: "La commande a été validée avec succès."
      });
    },
    onError: (error) => {
      console.error('Error validating order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de valider la commande.",
        variant: "destructive"
      });
    }
  });
};

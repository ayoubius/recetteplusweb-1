
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Address {
  id: string;
  label: string;
  address: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
}

const AddressesTab = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  // Fetch user addresses
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['user-addresses', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      
      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!currentUser
  });

  // Add address mutation
  const addAddressMutation = useMutation({
    mutationFn: async (addressData: typeof newAddress) => {
      if (!currentUser) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_locations')
        .insert({
          user_id: currentUser.id,
          label: addressData.label,
          address: addressData.address,
          latitude: addressData.latitude ? parseFloat(addressData.latitude) : null,
          longitude: addressData.longitude ? parseFloat(addressData.longitude) : null,
          is_default: addresses.length === 0 // First address is default
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      setIsAddingAddress(false);
      setNewAddress({ label: '', address: '', latitude: '', longitude: '' });
      toast({
        title: "Adresse ajoutée",
        description: "Votre nouvelle adresse a été ajoutée avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'adresse.",
        variant: "destructive"
      });
    }
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const { error } = await supabase
        .from('user_locations')
        .delete()
        .eq('id', addressId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      toast({
        title: "Adresse supprimée",
        description: "L'adresse a été supprimée avec succès."
      });
    }
  });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.address) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    addAddressMutation.mutate(newAddress);
  };

  const handleDeleteAddress = (addressId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      deleteAddressMutation.mutate(addressId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Mes adresses
          <Button 
            onClick={() => setIsAddingAddress(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAddingAddress && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Nouvelle adresse</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAddress} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="label">Libellé *</Label>
                    <Input
                      id="label"
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                      placeholder="Maison, Bureau, etc."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse *</Label>
                    <Input
                      id="address"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                      placeholder="Adresse complète"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude (optionnel)</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={newAddress.latitude}
                      onChange={(e) => setNewAddress({...newAddress, latitude: e.target.value})}
                      placeholder="12.6392"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude (optionnel)</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={newAddress.longitude}
                      onChange={(e) => setNewAddress({...newAddress, longitude: e.target.value})}
                      placeholder="-8.0029"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={addAddressMutation.isPending}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {addAddressMutation.isPending ? 'Ajout...' : 'Ajouter'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddingAddress(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 border rounded-lg">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : addresses.length > 0 ? (
          <div className="space-y-4">
            {addresses.map((address: Address) => (
              <div key={address.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-orange-500 mt-1" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{address.label}</h4>
                        {address.is_default && (
                          <Badge variant="default" className="text-xs">
                            Par défaut
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{address.address}</p>
                      {address.latitude && address.longitude && (
                        <p className="text-xs text-gray-500 mt-1">
                          Coordonnées: {address.latitude}, {address.longitude}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={deleteAddressMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune adresse enregistrée</p>
            <p className="text-sm">Ajoutez votre première adresse de livraison</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressesTab;

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useAssignOrderToDelivery, useUpdateDeliveryLocation } from '@/hooks/useDeliveryTracking';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { QrCode, MapPin, Package, Truck, CheckCircle, ExternalLink, User, Phone } from 'lucide-react';
import { formatCFA } from '@/lib/currency';

const DeliveryDashboard = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState('');

  const { data: orders = [], refetch } = useOrders();
  const assignOrderMutation = useAssignOrderToDelivery();
  const updateStatusMutation = useUpdateOrderStatus();
  const updateLocationMutation = useUpdateDeliveryLocation();

  // Filtrer les commandes pour le livreur actuel
  const myOrders = orders.filter(order => 
    order.assigned_to === currentUser?.id || 
    ['validated', 'assigned', 'picked_up', 'in_transit'].includes(order.status)
  );

  const handleScanQR = async () => {
    if (!qrCode.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un code QR",
        variant: "destructive"
      });
      return;
    }

    try {
      // Extraire l'ID de commande du code QR (format: QR_orderId_timestamp)
      const parts = qrCode.split('_');
      if (parts.length >= 2) {
        const orderId = parts[1];
        await assignOrderMutation.mutateAsync({ orderId, qrCode });
        setQrCode('');
        refetch();
      } else {
        throw new Error('Format de code QR invalide');
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (orderId: string, status: any) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status });
      
      // Si c'est le début du transport, démarrer le partage de localisation
      if (status === 'in_transit') {
        startLocationSharing(orderId);
      }
      
      refetch();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const startLocationSharing = (orderId: string) => {
    if (!navigator.geolocation) {
      toast({
        title: "Erreur",
        description: "La géolocalisation n'est pas supportée par votre navigateur",
        variant: "destructive"
      });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        updateLocationMutation.mutate({
          orderId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          status: 'en_route',
          notes: 'Position mise à jour automatiquement'
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );

    // Stocker l'ID de surveillance pour pouvoir l'arrêter plus tard
    (window as any).deliveryWatchId = watchId;
  };

  const openGoogleMaps = (order: any) => {
    if (order.delivery_latitude && order.delivery_longitude) {
      const url = `https://www.google.com/maps?q=${order.delivery_latitude},${order.delivery_longitude}`;
      window.open(url, '_blank');
    } else if (order.delivery_address) {
      const address = `${order.delivery_address.street}, ${order.delivery_address.city}, ${order.delivery_address.postal_code}`;
      const encodedAddress = encodeURIComponent(address);
      const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(url, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'picked_up': return 'bg-orange-100 text-orange-800';
      case 'in_transit': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case 'assigned': return { action: 'picked_up', label: 'Marquer comme récupérée', icon: Package };
      case 'picked_up': return { action: 'in_transit', label: 'Commencer la livraison', icon: Truck };
      case 'in_transit': return { action: 'delivered', label: 'Marquer comme livrée', icon: CheckCircle };
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header mobile-first */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Tableau de bord livreur</h1>
          <p className="text-sm text-gray-600 mb-4">Gérez vos livraisons et suivez vos commandes</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Scanner QR - Mobile optimized */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <div className="p-2 bg-orange-100 rounded-full">
                <QrCode className="h-4 w-4 text-orange-600" />
              </div>
              <span>Scanner une commande</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input
                placeholder="Code QR de la commande"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                className="h-12 text-base"
              />
              <Button 
                onClick={handleScanQR}
                disabled={assignOrderMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3"
              >
                {assignOrderMutation.isPending ? 'Traitement...' : 'Scanner la commande'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des commandes - Mobile cards */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 px-1">Mes commandes</h2>
          
          {myOrders.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Aucune commande assignée</p>
                <p className="text-sm text-gray-500">Scannez un code QR pour commencer</p>
              </CardContent>
            </Card>
          ) : (
            myOrders.map((order) => {
              const nextAction = getNextAction(order.status);
              
              return (
                <Card key={order.id} className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {/* Header avec ID et statut */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-orange-100 rounded-full">
                          <Package className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-semibold text-gray-900">#{order.id.slice(0, 8)}</span>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} text-xs px-3 py-1`}>
                        {order.status}
                      </Badge>
                    </div>

                    {/* Adresse de livraison */}
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-blue-900 mb-1">Adresse de livraison</div>
                          <div className="text-sm text-blue-800">
                            {order.delivery_address.street}<br />
                            {order.delivery_address.city}, {order.delivery_address.postal_code}
                          </div>
                          {order.delivery_notes && (
                            <div className="text-xs text-blue-700 mt-2 italic">
                              Note: {order.delivery_notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Montant */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">Montant à collecter</span>
                      <span className="font-bold text-xl text-green-600">
                        {formatCFA(order.total_amount)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      {nextAction && (
                        <Button
                          onClick={() => handleUpdateStatus(order.id, nextAction.action)}
                          disabled={updateStatusMutation.isPending}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3"
                        >
                          <nextAction.icon className="h-4 w-4 mr-2" />
                          {nextAction.label}
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        onClick={() => openGoogleMaps(order)}
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ouvrir dans Maps
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOrders } from '@/hooks/useOrders';
import { useSupabaseUsers } from '@/hooks/useSupabaseUsers';
import { Truck, MapPin, Clock, User, Navigation, Search, ExternalLink, Phone, Mail, Package } from 'lucide-react';
import { Order } from '@/hooks/useOrders';
import { formatCFA } from '@/lib/currency';

const DeliveryManagement: React.FC = () => {
  const { data: orders = [] } = useOrders();
  const { data: users = [] } = useSupabaseUsers();
  const [searchTerm, setSearchTerm] = useState('');

  const deliveryOrders = orders.filter(order => 
    ['assigned', 'picked_up', 'in_transit', 'delivered'].includes(order.status)
  );

  const filteredOrders = deliveryOrders.filter(order => {
    const deliveryPerson = users.find(u => u.id === order.assigned_to);
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.delivery_address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deliveryPerson?.display_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'picked_up': return 'bg-orange-100 text-orange-800';
      case 'in_transit': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'assigned': return 'Assignée';
      case 'picked_up': return 'Récupérée';
      case 'in_transit': return 'En livraison';
      case 'delivered': return 'Livrée';
      default: return status;
    }
  };

  const openGoogleMaps = (order: Order) => {
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

  const activeDeliveries = filteredOrders.filter(o => ['assigned', 'picked_up', 'in_transit'].includes(o.status));
  const completedDeliveries = filteredOrders.filter(o => o.status === 'delivered');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile-first */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 mb-3">Gestion des Livraisons</h1>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une livraison..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Statistiques - Grid mobile optimized */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500 rounded-full">
                  <Truck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-indigo-700 font-medium">Livraisons actives</p>
                  <p className="text-xl font-bold text-indigo-800">{activeDeliveries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-full">
                  <Navigation className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-green-700 font-medium">En livraison</p>
                  <p className="text-xl font-bold text-green-800">
                    {filteredOrders.filter(o => o.status === 'in_transit').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Livraisons actives */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 px-1">Livraisons en Cours</h2>
          
          {activeDeliveries.map((order) => {
            const deliveryPerson = users.find(u => u.id === order.assigned_to);
            const customer = users.find(u => u.id === order.user_id);
            
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
                      {getStatusText(order.status)}
                    </Badge>
                  </div>

                  {/* Informations client */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">
                        {customer?.display_name || 'Client'}
                      </span>
                    </div>
                    {customer?.phone_number && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{customer.phone_number}</span>
                      </div>
                    )}
                  </div>

                  {/* Livreur assigné */}
                  {deliveryPerson && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          {deliveryPerson.display_name}
                        </span>
                      </div>
                      {order.assigned_at && (
                        <div className="text-xs text-blue-700">
                          Assigné le {new Date(order.assigned_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Adresse et montant */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{order.delivery_address.street}</div>
                        <div className="text-gray-600">
                          {order.delivery_address.city}, {order.delivery_address.postal_code}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Montant</span>
                      <span className="font-bold text-lg text-orange-600">{formatCFA(order.total_amount)}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    variant="outline"
                    onClick={() => openGoogleMaps(order)}
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ouvrir dans Maps
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          {activeDeliveries.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Aucune livraison active</p>
                <p className="text-sm text-gray-500">Toutes les livraisons sont terminées</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Livraisons récentes */}
        {completedDeliveries.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 px-1">Livraisons Récentes</h2>
            
            {completedDeliveries.slice(0, 5).map((order) => {
              const deliveryPerson = users.find(u => u.id === order.assigned_to);
              const customer = users.find(u => u.id === order.user_id);
              
              return (
                <Card key={order.id} className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Package className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-semibold text-green-900">#{order.id.slice(0, 8)}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Livrée
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700">{customer?.display_name || 'Client'}</span>
                      <span className="font-semibold text-green-800">{formatCFA(order.total_amount)}</span>
                    </div>
                    
                    <div className="text-xs text-green-600 mt-1">
                      {deliveryPerson?.display_name} • {order.delivery_address.city}
                    </div>
                    
                    {order.delivered_at && (
                      <div className="text-xs text-green-500 mt-1">
                        Livrée le {new Date(order.delivered_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryManagement;

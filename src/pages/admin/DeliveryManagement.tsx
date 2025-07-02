
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOrders } from '@/hooks/useOrders';
import { useDeliveryTracking } from '@/hooks/useDeliveryTracking';
import { useSupabaseUsers } from '@/hooks/useSupabaseUsers';
import { Truck, MapPin, Clock, User, Navigation, Search, ExternalLink } from 'lucide-react';
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
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl lg:text-2xl font-bold">Gestion des Livraisons</h1>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une livraison..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-600">Livraisons actives</p>
                <p className="text-xl lg:text-2xl font-bold">{activeDeliveries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">En cours de livraison</p>
                <p className="text-xl lg:text-2xl font-bold">
                  {filteredOrders.filter(o => o.status === 'in_transit').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Livrées aujourd'hui</p>
                <p className="text-xl lg:text-2xl font-bold">
                  {completedDeliveries.filter(o => 
                    new Date(o.delivered_at || '').toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Livraisons actives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Livraisons en Cours</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Commande</TableHead>
                  <TableHead className="min-w-[120px]">Livreur</TableHead>
                  <TableHead className="min-w-[100px]">Client</TableHead>
                  <TableHead className="min-w-[150px]">Adresse</TableHead>
                  <TableHead className="min-w-[100px]">Montant</TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                  <TableHead className="min-w-[130px]">Assignation</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeDeliveries.map((order) => {
                  const deliveryPerson = users.find(u => u.id === order.assigned_to);
                  const customer = users.find(u => u.id === order.user_id);
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="truncate">{deliveryPerson?.display_name || 'Non assigné'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="truncate">{customer?.display_name || 'Client'}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start space-x-1">
                          <MapPin className="h-3 w-3 text-gray-400 mt-1 flex-shrink-0" />
                          <div className="text-sm">
                            <div className="truncate">{order.delivery_address.street}</div>
                            <div className="text-gray-500 truncate">
                              {order.delivery_address.city}, {order.delivery_address.postal_code}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCFA(order.total_amount)}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(order.status)} text-xs`}>
                          {getStatusText(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.assigned_at ? new Date(order.assigned_at).toLocaleString('fr-FR') : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openGoogleMaps(order)}
                            className="text-xs"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Maps
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {activeDeliveries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune livraison active pour le moment
            </div>
          )}
        </CardContent>
      </Card>

      {/* Livraisons terminées récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Livraisons Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Commande</TableHead>
                  <TableHead className="min-w-[120px]">Livreur</TableHead>
                  <TableHead className="min-w-[100px]">Client</TableHead>
                  <TableHead className="min-w-[150px]">Adresse</TableHead>
                  <TableHead className="min-w-[100px]">Montant</TableHead>
                  <TableHead className="min-w-[130px]">Livraison</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedDeliveries.slice(0, 10).map((order) => {
                  const deliveryPerson = users.find(u => u.id === order.assigned_to);
                  const customer = users.find(u => u.id === order.user_id);
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="truncate">
                        {deliveryPerson?.display_name || 'Non assigné'}
                      </TableCell>
                      <TableCell className="truncate">
                        {customer?.display_name || 'Client'}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm truncate">
                          {order.delivery_address.city}, {order.delivery_address.postal_code}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCFA(order.total_amount)}</TableCell>
                      <TableCell className="text-sm">
                        {order.delivered_at ? new Date(order.delivered_at).toLocaleString('fr-FR') : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {completedDeliveries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune livraison terminée récemment
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryManagement;

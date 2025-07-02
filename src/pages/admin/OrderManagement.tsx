
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOrders, useUpdateOrderStatus, useValidateOrder } from '@/hooks/useOrders';
import { useSupabaseUsers } from '@/hooks/useSupabaseUsers';
import { Package, Clock, CheckCircle, User, Truck, MapPin, Search, ExternalLink } from 'lucide-react';
import { Order } from '@/hooks/useOrders';
import { formatCFA } from '@/lib/currency';

const OrderManagement: React.FC = () => {
  const { data: orders = [], isLoading } = useOrders();
  const { data: users = [] } = useSupabaseUsers();
  const updateOrderStatus = useUpdateOrderStatus();
  const validateOrder = useValidateOrder();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'validated': return <CheckCircle className="h-4 w-4" />;
      case 'assigned': return <User className="h-4 w-4" />;
      case 'picked_up': return <Package className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'validated': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'picked_up': return 'bg-orange-100 text-orange-800';
      case 'in_transit': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'validated': return 'Validée';
      case 'assigned': return 'Assignée';
      case 'picked_up': return 'Récupérée';
      case 'in_transit': return 'En cours de livraison';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const handleValidateOrder = async (orderId: string) => {
    await validateOrder.mutateAsync(orderId);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    await updateOrderStatus.mutateAsync({
      orderId,
      status: newStatus
    });
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

  const deliveryPersons = users.filter(user => 
    ['delivery_person', 'admin', 'manager', 'admin_assistant'].includes(user.role || 'user')
  );

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.delivery_address.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const ordersByStatus = {
    pending: filteredOrders.filter(o => o.status === 'pending'),
    validated: filteredOrders.filter(o => o.status === 'validated'),
    assigned: filteredOrders.filter(o => o.status === 'assigned'),
    in_progress: filteredOrders.filter(o => ['picked_up', 'in_transit'].includes(o.status)),
    completed: filteredOrders.filter(o => ['delivered', 'cancelled'].includes(o.status)),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <h1 className="text-xl lg:text-2xl font-bold">Gestion des Commandes</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="validated">Validées</SelectItem>
              <SelectItem value="assigned">Assignées</SelectItem>
              <SelectItem value="picked_up">Récupérées</SelectItem>
              <SelectItem value="in_transit">En livraison</SelectItem>
              <SelectItem value="delivered">Livrées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 lg:h-5 w-4 lg:w-5 text-yellow-500" />
              <div>
                <p className="text-xs lg:text-sm text-gray-600">En attente</p>
                <p className="text-lg lg:text-2xl font-bold">{ordersByStatus.pending.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 lg:h-5 w-4 lg:w-5 text-blue-500" />
              <div>
                <p className="text-xs lg:text-sm text-gray-600">Validées</p>
                <p className="text-lg lg:text-2xl font-bold">{ordersByStatus.validated.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 lg:h-5 w-4 lg:w-5 text-purple-500" />
              <div>
                <p className="text-xs lg:text-sm text-gray-600">Assignées</p>
                <p className="text-lg lg:text-2xl font-bold">{ordersByStatus.assigned.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 lg:h-5 w-4 lg:w-5 text-indigo-500" />
              <div>
                <p className="text-xs lg:text-sm text-gray-600">En cours</p>
                <p className="text-lg lg:text-2xl font-bold">{ordersByStatus.in_progress.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 lg:h-5 w-4 lg:w-5 text-green-500" />
              <div>
                <p className="text-xs lg:text-sm text-gray-600">Terminées</p>
                <p className="text-lg lg:text-2xl font-bold">{ordersByStatus.completed.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des commandes */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Commande</TableHead>
                  <TableHead className="min-w-[100px]">Client</TableHead>
                  <TableHead className="min-w-[100px]">Montant</TableHead>
                  <TableHead className="min-w-[150px]">Adresse</TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                  <TableHead className="min-w-[80px]">Code QR</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="truncate">
                      {users.find(u => u.id === order.user_id)?.display_name || 'Utilisateur'}
                    </TableCell>
                    <TableCell className="font-medium">{formatCFA(order.total_amount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {order.delivery_address.city}, {order.delivery_address.postal_code}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)} text-xs`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span>{getStatusText(order.status)}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {order.qr_code?.slice(-8)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col lg:flex-row gap-2">
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleValidateOrder(order.id)}
                            disabled={validateOrder.isPending}
                            className="text-xs"
                          >
                            Valider
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openGoogleMaps(order)}
                          className="text-xs"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Maps
                        </Button>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleUpdateStatus(order.id, value as Order['status'])}
                          >
                            <SelectTrigger className="w-32 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="validated">Validée</SelectItem>
                              <SelectItem value="assigned">Assignée</SelectItem>
                              <SelectItem value="picked_up">Récupérée</SelectItem>
                              <SelectItem value="in_transit">En livraison</SelectItem>
                              <SelectItem value="delivered">Livrée</SelectItem>
                              <SelectItem value="cancelled">Annulée</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;

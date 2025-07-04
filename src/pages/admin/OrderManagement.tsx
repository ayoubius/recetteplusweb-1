
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOrders, useUpdateOrderStatus, useValidateOrder } from '@/hooks/useOrders';
import { useSupabaseUsers } from '@/hooks/useSupabaseUsers';
import { Package, Clock, CheckCircle, User, Truck, MapPin, Search, ExternalLink, Phone, Mail } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile-first */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 mb-3">Gestion des Commandes</h1>
          
          {/* Search and filters - mobile optimized */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 text-base">
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
      </div>

      <div className="p-4 space-y-4">
        {/* Statistiques - Grid mobile optimized */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-500 rounded-full">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-yellow-700 font-medium">En attente</p>
                  <p className="text-xl font-bold text-yellow-800">{ordersByStatus.pending.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-full">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-700 font-medium">Validées</p>
                  <p className="text-xl font-bold text-blue-800">{ordersByStatus.validated.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-full">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-purple-700 font-medium">Assignées</p>
                  <p className="text-xl font-bold text-purple-800">{ordersByStatus.assigned.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500 rounded-full">
                  <Truck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-indigo-700 font-medium">En cours</p>
                  <p className="text-xl font-bold text-indigo-800">{ordersByStatus.in_progress.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des commandes - Mobile cards */}
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const customer = users.find(u => u.id === order.user_id);
            const deliveryPerson = users.find(u => u.id === order.assigned_to);
            
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
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </div>
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
                    {customer?.email && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{customer.email}</span>
                      </div>
                    )}
                    {customer?.phone_number && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{customer.phone_number}</span>
                      </div>
                    )}
                  </div>

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
                      <span className="text-sm text-gray-600">Montant total</span>
                      <span className="font-bold text-lg text-orange-600">{formatCFA(order.total_amount)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Créée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Livreur assigné */}
                  {deliveryPerson && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Livreur: {deliveryPerson.display_name}
                        </span>
                      </div>
                      {order.assigned_at && (
                        <div className="text-xs text-blue-700 mt-1">
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

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    {order.status === 'pending' && (
                      <Button
                        onClick={() => handleValidateOrder(order.id)}
                        disabled={validateOrder.isPending}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3"
                      >
                        {validateOrder.isPending ? 'Validation...' : 'Valider la commande'}
                      </Button>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => openGoogleMaps(order)}
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Maps
                      </Button>
                      
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="flex-1">
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleUpdateStatus(order.id, value as Order['status'])}
                          >
                            <SelectTrigger className="w-full h-10 text-sm">
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
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Aucune commande trouvée</p>
              <p className="text-sm text-gray-500">Essayez de modifier vos filtres de recherche</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;

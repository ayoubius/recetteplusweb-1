
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useUserOrders } from '@/hooks/useOrders';
import { formatCFA } from '@/lib/currency';
import { ShoppingBag, Eye, Clock, CheckCircle, Truck, Package } from 'lucide-react';
import OrderDetailsDialog from '@/components/order/OrderDetailsDialog';

const OrdersTab = () => {
  const { currentUser } = useAuth();
  const { data: userOrders = [], isLoading } = useUserOrders(currentUser?.id);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'validated':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'in_transit':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'validated':
        return 'Validée';
      case 'in_transit':
        return 'En livraison';
      case 'delivered':
        return 'Livrée';
      default:
        return 'Inconnue';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary' as const;
      case 'validated':
        return 'default' as const;
      case 'in_transit':
        return 'default' as const;
      case 'delivered':
        return 'default' as const;
      default:
        return 'outline' as const;
    }
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Mes commandes</CardTitle>
        </CardHeader>
        <CardContent>
          {userOrders.length > 0 ? (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <Card key={order.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">
                          Commande #{order.id.slice(0, 8).toUpperCase()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total</p>
                        <p className="text-lg font-bold text-orange-600">
                          {formatCFA(order.total_amount)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600">Articles</p>
                        <p className="text-sm">
                          {Array.isArray(order.items) ? order.items.length : 0} article(s)
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600">Livraison</p>
                        <p className="text-sm text-gray-700">
                          {order.delivery_fee ? formatCFA(order.delivery_fee) : 'Gratuite'}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune commande pour le moment</p>
              <p className="text-sm">Vos commandes apparaîtront ici</p>
            </div>
          )}
        </CardContent>
      </Card>

      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isOrderDetailsOpen}
        onClose={() => {
          setIsOrderDetailsOpen(false);
          setSelectedOrder(null);
        }}
      />
    </>
  );
};

export default OrdersTab;

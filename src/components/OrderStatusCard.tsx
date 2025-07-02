
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Package, Truck, CheckCircle, User } from 'lucide-react';
import { Order } from '@/hooks/useOrders';

interface OrderStatusCardProps {
  order: Order;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ order }) => {
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'validated':
        return <CheckCircle className="h-4 w-4" />;
      case 'assigned':
        return <User className="h-4 w-4" />;
      case 'picked_up':
        return <Package className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'validated':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      case 'picked_up':
        return 'bg-orange-100 text-orange-800';
      case 'in_transit':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'validated':
        return 'Validée';
      case 'assigned':
        return 'Assignée';
      case 'picked_up':
        return 'Récupérée';
      case 'in_transit':
        return 'En cours de livraison';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Commande #{order.id.slice(0, 8)}</CardTitle>
          <Badge className={getStatusColor(order.status)}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(order.status)}
              <span>{getStatusText(order.status)}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Montant total</span>
          <span className="font-semibold">{formatPrice(order.total_amount)}</span>
        </div>
        
        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium">Adresse de livraison</div>
            <div className="text-gray-600">
              {order.delivery_address.street}<br />
              {order.delivery_address.city}, {order.delivery_address.postal_code}
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Commande passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>

        {order.qr_code && (
          <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
            Code QR: {order.qr_code}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderStatusCard;

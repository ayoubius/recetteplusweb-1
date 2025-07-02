
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  Clock,
  CheckCircle,
  Truck,
  Eye,
  Star
} from 'lucide-react';
import { formatCFA } from '@/lib/currency';

interface OrderDetailsDialogProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsDialog = ({ order, isOpen, onClose }: OrderDetailsDialogProps) => {
  if (!order) return null;

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

  const orderItems = Array.isArray(order.items) ? order.items : [];
  const deliveryAddress = order.delivery_address || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Détails de la commande #{order.id.slice(0, 8).toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Statut et informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Informations générales</span>
                <Badge className="flex items-center gap-1">
                  {getStatusIcon(order.status)}
                  {getStatusLabel(order.status)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Date de commande</p>
                  <p className="font-medium">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-bold text-lg text-orange-600">
                    {formatCFA(order.total_amount)}
                  </p>
                  {order.delivery_fee && (
                    <p className="text-xs text-gray-500">
                      dont {formatCFA(order.delivery_fee)} de frais de livraison
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles commandés */}
          <Card>
            <CardHeader>
              <CardTitle>Articles commandés ({orderItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderItems.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name || item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Quantité: {item.quantity} × {formatCFA(item.unit_price || item.price || 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-600">
                        {formatCFA(item.total_price || (item.quantity * (item.unit_price || item.price || 0)))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Adresse de livraison */}
          {deliveryAddress && Object.keys(deliveryAddress).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Adresse de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {deliveryAddress.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">{deliveryAddress.address}</p>
                      {deliveryAddress.details && (
                        <p className="text-sm text-gray-600">{deliveryAddress.details}</p>
                      )}
                    </div>
                  </div>
                )}

                {deliveryAddress.name && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <p>{deliveryAddress.name}</p>
                  </div>
                )}

                {deliveryAddress.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <p>{deliveryAddress.phone}</p>
                  </div>
                )}

                {order.google_maps_link && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(order.google_maps_link, '_blank')}
                    className="mt-2"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Voir sur Google Maps
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timeline de livraison */}
          <Card>
            <CardHeader>
              <CardTitle>Suivi de livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-3 rounded-lg text-center ${order.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                  <Clock className={`h-6 w-6 mx-auto mb-2 ${order.status === 'pending' ? 'text-yellow-500' : 'text-gray-400'}`} />
                  <p className="text-xs font-medium">Commande</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                <div className={`p-3 rounded-lg text-center ${['validated', 'in_transit', 'delivered'].includes(order.status) ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                  <CheckCircle className={`h-6 w-6 mx-auto mb-2 ${['validated', 'in_transit', 'delivered'].includes(order.status) ? 'text-blue-500' : 'text-gray-400'}`} />
                  <p className="text-xs font-medium">Validée</p>
                  {order.validated_at && (
                    <p className="text-xs text-gray-500">
                      {new Date(order.validated_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
                
                <div className={`p-3 rounded-lg text-center ${['in_transit', 'delivered'].includes(order.status) ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'}`}>
                  <Truck className={`h-6 w-6 mx-auto mb-2 ${['in_transit', 'delivered'].includes(order.status) ? 'text-purple-500' : 'text-gray-400'}`} />
                  <p className="text-xs font-medium">En livraison</p>
                  {order.picked_up_at && (
                    <p className="text-xs text-gray-500">
                      {new Date(order.picked_up_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
                
                <div className={`p-3 rounded-lg text-center ${order.status === 'delivered' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                  <CheckCircle className={`h-6 w-6 mx-auto mb-2 ${order.status === 'delivered' ? 'text-green-500' : 'text-gray-400'}`} />
                  <p className="text-xs font-medium">Livrée</p>
                  {order.delivered_at && (
                    <p className="text-xs text-gray-500">
                      {new Date(order.delivered_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code si disponible */}
          {order.qr_code && (
            <Card>
              <CardHeader>
                <CardTitle>Code de commande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="font-mono text-lg font-bold">{order.qr_code}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Présentez ce code au livreur
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {order.status === 'delivered' && (
              <Button variant="outline" className="flex-1">
                <Star className="h-4 w-4 mr-2" />
                Laisser un avis
              </Button>
            )}
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;

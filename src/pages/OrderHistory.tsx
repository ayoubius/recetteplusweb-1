
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useUserOrders } from '@/hooks/useOrders';
import { formatCFA } from '@/lib/currency';

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading } = useUserOrders(currentUser?.id);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <ShoppingBag className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-gray-900">Connexion requise</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

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
        return 'secondary';
      case 'validated':
        return 'default';
      case 'in_transit':
        return 'default';
      case 'delivered':
        return 'default';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag className="h-12 w-12 text-orange-500 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Mes Commandes
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Suivez l'état de vos commandes et votre historique d'achats
          </p>
          {orders.length > 0 && (
            <Badge variant="secondary" className="mt-2">
              {orders.length} commande{orders.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <Card key={order.id} className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Commande #{order.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
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
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-1">Total</h4>
                      <p className="text-lg font-bold text-orange-600">
                        {formatCFA(order.total_amount)}
                      </p>
                      {order.delivery_fee && (
                        <p className="text-xs text-gray-500">
                          + {formatCFA(order.delivery_fee)} livraison
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-1">Articles</h4>
                      <p className="text-sm">
                        {Array.isArray(order.items) ? order.items.length : 0} article(s)
                      </p>
                    </div>

                    {order.delivery_address && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-1">Livraison</h4>
                        <p className="text-sm text-gray-700">
                          {typeof order.delivery_address === 'object' && order.delivery_address !== null
                            ? (order.delivery_address as any).address || 'Adresse non spécifiée'
                            : 'Adresse non spécifiée'
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className={`p-3 rounded-lg ${order.status === 'pending' ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                      <Clock className={`h-6 w-6 mx-auto mb-2 ${order.status === 'pending' ? 'text-yellow-500' : 'text-gray-400'}`} />
                      <p className="text-xs font-medium">Commande</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${['validated', 'in_transit', 'delivered'].includes(order.status) ? 'bg-blue-50' : 'bg-gray-50'}`}>
                      <CheckCircle className={`h-6 w-6 mx-auto mb-2 ${['validated', 'in_transit', 'delivered'].includes(order.status) ? 'text-blue-500' : 'text-gray-400'}`} />
                      <p className="text-xs font-medium">Validée</p>
                      {order.validated_at && (
                        <p className="text-xs text-gray-500">
                          {new Date(order.validated_at).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                    
                    <div className={`p-3 rounded-lg ${['in_transit', 'delivered'].includes(order.status) ? 'bg-purple-50' : 'bg-gray-50'}`}>
                      <Truck className={`h-6 w-6 mx-auto mb-2 ${['in_transit', 'delivered'].includes(order.status) ? 'text-purple-500' : 'text-gray-400'}`} />
                      <p className="text-xs font-medium">En livraison</p>
                      {order.picked_up_at && (
                        <p className="text-xs text-gray-500">
                          {new Date(order.picked_up_at).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                    
                    <div className={`p-3 rounded-lg ${order.status === 'delivered' ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <CheckCircle className={`h-6 w-6 mx-auto mb-2 ${order.status === 'delivered' ? 'text-green-500' : 'text-gray-400'}`} />
                      <p className="text-xs font-medium">Livrée</p>
                      {order.delivered_at && (
                        <p className="text-xs text-gray-500">
                          {new Date(order.delivered_at).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <Button variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Recommander
                    </Button>
                    {order.status === 'delivered' && (
                      <Button variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Laisser un avis
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="text-center py-16">
                <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-600 mb-4">
                  Aucune commande pour le moment
                </h3>
                <p className="text-gray-500 mb-6">
                  Commencez vos achats pour voir vos commandes apparaître ici
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  <Package className="h-4 w-4 mr-2" />
                  Découvrir nos produits
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;

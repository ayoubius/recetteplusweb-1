
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderSuccessProps {
  orderId?: string;
  onContinueShopping: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ orderId, onContinueShopping }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-600">
            Commande confirmée !
          </CardTitle>
          {orderId && (
            <p className="text-gray-600 mt-2">
              Numéro de commande : <span className="font-mono font-bold">#{orderId.slice(0, 8).toUpperCase()}</span>
            </p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Prochaines étapes :</h3>
            <div className="space-y-2 text-sm text-green-700">
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                <span>Votre commande est en cours de traitement</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>Préparation : 15-30 minutes</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Livraison : 30-60 minutes</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Informations importantes :</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Vous recevrez un appel de confirmation</li>
              <li>• Le livreur vous contactera avant d'arriver</li>
              <li>• Ayez votre paiement prêt si vous payez à la livraison</li>
              <li>• Gardez votre téléphone à portée de main</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <Link to="/historique-commandes">
              <Button variant="outline" className="w-full">
                <Package className="h-4 w-4 mr-2" />
                Voir mes commandes
              </Button>
            </Link>
            
            <Button 
              onClick={onContinueShopping}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              <Package className="h-4 w-4 mr-2" />
              Continuer mes achats
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;

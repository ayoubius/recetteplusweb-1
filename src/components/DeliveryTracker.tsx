
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { useDeliveryTracking } from '@/hooks/useDeliveryTracking';

interface DeliveryTrackerProps {
  orderId: string;
}

const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({ orderId }) => {
  const { data: trackingData = [], isLoading } = useDeliveryTracking(orderId);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  const latestTracking = trackingData[trackingData.length - 1];

  useEffect(() => {
    if (latestTracking?.latitude && latestTracking?.longitude) {
      setCurrentLocation({
        lat: latestTracking.latitude,
        lng: latestTracking.longitude
      });
    }
  }, [latestTracking]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
            <span>Chargement du suivi...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trackingData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Suivi de livraison</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Aucune information de suivi disponible pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Navigation className="h-5 w-5" />
          <span>Suivi de livraison en temps réel</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentLocation && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Position actuelle</span>
            </div>
            <div className="text-sm text-blue-700">
              Latitude: {currentLocation.lat.toFixed(6)}<br />
              Longitude: {currentLocation.lng.toFixed(6)}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Historique de livraison</span>
          </h4>
          
          {trackingData.map((tracking, index) => (
            <div key={tracking.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
              <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {tracking.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(tracking.created_at).toLocaleDateString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {tracking.notes && (
                  <p className="text-sm text-gray-600">{tracking.notes}</p>
                )}
                {tracking.latitude && tracking.longitude && (
                  <p className="text-xs text-gray-500 mt-1">
                    Position: {tracking.latitude.toFixed(6)}, {tracking.longitude.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryTracker;

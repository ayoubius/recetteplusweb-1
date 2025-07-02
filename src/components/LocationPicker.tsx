
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationPickerProps {
  onLocationSelect: (latitude: number, longitude: number) => void;
  selectedLocation?: { latitude: number; longitude: number } | null;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  onLocationSelect, 
  selectedLocation 
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation.",
        variant: "destructive"
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSelect(latitude, longitude);
        toast({
          title: "Position obtenue",
          description: "Votre position a été enregistrée pour la livraison."
        });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        toast({
          title: "Erreur de géolocalisation",
          description: "Impossible d'obtenir votre position. Veuillez réessayer.",
          variant: "destructive"
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Position de livraison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedLocation ? (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800 font-medium">Position enregistrée ✓</p>
            <p className="text-xs text-green-600 mt-1">
              Latitude: {selectedLocation.latitude.toFixed(6)}<br />
              Longitude: {selectedLocation.longitude.toFixed(6)}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="mt-2"
            >
              Changer la position
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Nous avons besoin de votre position pour organiser la livraison.
            </p>
            <Button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {isGettingLocation ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Obtention de la position...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Obtenir ma position
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationPicker;

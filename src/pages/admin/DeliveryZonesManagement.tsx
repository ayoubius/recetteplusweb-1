
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';

interface DeliveryZone {
  id: string;
  name: string;
  description: string | null;
  delivery_fee: number;
  min_delivery_time: number | null;
  max_delivery_time: number | null;
  is_active: boolean;
}

const DeliveryZonesManagement: React.FC = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <MapPin className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gestion des Zones de Livraison</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Zone
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zones de livraison</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : zones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune zone de livraison configurée
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Frais de livraison</TableHead>
                  <TableHead>Temps de livraison</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones.map((zone) => (
                  <TableRow key={zone.id}>
                    <TableCell className="font-medium">{zone.name}</TableCell>
                    <TableCell>{zone.description || '-'}</TableCell>
                    <TableCell>{zone.delivery_fee}€</TableCell>
                    <TableCell>
                      {zone.min_delivery_time && zone.max_delivery_time
                        ? `${zone.min_delivery_time}-${zone.max_delivery_time}min`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={zone.is_active ? "default" : "secondary"}>
                        {zone.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryZonesManagement;

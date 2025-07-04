
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Edit, Save } from 'lucide-react';

interface AdminPermission {
  id: string;
  user_id: string;
  is_super_admin: boolean;
  can_manage_users: boolean;
  can_manage_products: boolean;
  can_manage_recipes: boolean;
  can_manage_videos: boolean;
  can_manage_categories: boolean;
  can_manage_orders: boolean;
  can_validate_orders: boolean;
  can_manage_deliveries: boolean;
  user_email?: string;
  user_name?: string;
}

const PermissionsManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const permissionLabels = {
    is_super_admin: 'Super Admin',
    can_manage_users: 'Gérer Utilisateurs',
    can_manage_products: 'Gérer Produits',
    can_manage_recipes: 'Gérer Recettes',
    can_manage_videos: 'Gérer Vidéos',
    can_manage_categories: 'Gérer Catégories',
    can_manage_orders: 'Gérer Commandes',
    can_validate_orders: 'Valider Commandes',
    can_manage_deliveries: 'Gérer Livraisons'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gestion des Permissions</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permissions des Administrateurs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : permissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune permission configurée
            </div>
          ) : (
            <div className="space-y-4">
              {permissions.map((permission) => (
                <Card key={permission.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">
                        {permission.user_name || permission.user_email || 'Utilisateur inconnu'}
                      </h3>
                      {permission.is_super_admin && (
                        <Badge variant="destructive" className="mt-1">
                          Super Admin
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(editingId === permission.id ? null : permission.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {editingId === permission.id && (
                        <Button variant="ghost" size="sm">
                          <Save className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(permissionLabels).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm">{label}</span>
                        <Switch
                          checked={permission[key as keyof AdminPermission] as boolean}
                          disabled={editingId !== permission.id || key === 'is_super_admin'}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsManagement;

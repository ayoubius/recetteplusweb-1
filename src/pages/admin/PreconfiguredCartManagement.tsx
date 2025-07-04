
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ShoppingCart, Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { usePreconfiguredCarts, useCreatePreconfiguredCart, useUpdatePreconfiguredCart, useDeletePreconfiguredCart, PreconfiguredCart } from '@/hooks/usePreconfiguredCarts';
import PreconfiguredCartForm from '@/components/admin/PreconfiguredCartForm';
import { formatPrice } from '@/lib/currency';

const PreconfiguredCartManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCart, setSelectedCart] = useState<PreconfiguredCart | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: carts = [], isLoading } = usePreconfiguredCarts();
  const createMutation = useCreatePreconfiguredCart();
  const updateMutation = useUpdatePreconfiguredCart();
  const deleteMutation = useDeletePreconfiguredCart();

  const filteredCarts = carts.filter(cart =>
    cart.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cart.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (data: Omit<PreconfiguredCart, 'id' | 'created_at'>) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setShowForm(false);
        setSelectedCart(null);
      }
    });
  };

  const handleUpdate = (data: Omit<PreconfiguredCart, 'id' | 'created_at'>) => {
    if (selectedCart) {
      updateMutation.mutate({ id: selectedCart.id, ...data }, {
        onSuccess: () => {
          setShowForm(false);
          setSelectedCart(null);
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const openEditForm = (cart: PreconfiguredCart) => {
    setSelectedCart(cart);
    setShowForm(true);
  };

  const openCreateForm = () => {
    setSelectedCart(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedCart(null);
  };

  if (showForm) {
    return (
      <div className="p-8">
        <PreconfiguredCartForm
          cart={selectedCart}
          onSubmit={selectedCart ? handleUpdate : handleCreate}
          onCancel={closeForm}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ShoppingCart className="h-8 w-8 text-orange-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Paniers Préconfigurés</h1>
            <p className="text-gray-600 mt-2">
              Gérez tous les paniers préconfigurés ({carts.length} paniers)
            </p>
          </div>
        </div>
        <Button onClick={openCreateForm} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Panier
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un panier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : filteredCarts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Aucun panier trouvé pour cette recherche' : 'Aucun panier préconfiguré trouvé'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCarts.map((cart) => (
                <Card key={cart.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {cart.image && (
                      <img
                        src={cart.image}
                        alt={cart.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold line-clamp-2">{cart.name}</h3>
                        <div className="flex space-x-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditForm(cart)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer le panier</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer le panier "{cart.name}" ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(cart.id)}>
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      {cart.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{cart.description}</p>
                      )}

                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary">{cart.category}</Badge>
                        {cart.is_featured && <Badge variant="default">En vedette</Badge>}
                        {!cart.is_active && <Badge variant="destructive">Inactif</Badge>}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold text-lg">
                          {formatPrice(cart.total_price || 0)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {cart.items?.length || 0} produits
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PreconfiguredCartManagement;

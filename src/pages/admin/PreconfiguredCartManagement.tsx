
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ShoppingCart, Plus, Edit, Trash2, Search } from 'lucide-react';
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
      <PreconfiguredCartForm
        cart={selectedCart}
        onSubmit={selectedCart ? handleUpdate : handleCreate}
        onCancel={closeForm}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="h-6 w-6 mr-2 text-orange-500" />
              Paniers
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {carts.length} paniers préconfigurés
            </p>
          </div>
          <Button onClick={openCreateForm} size="sm" className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:block p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="h-8 w-8 mr-3 text-orange-500" />
              Paniers Préconfigurés ({carts.length})
            </h1>
          </div>
          <Button onClick={openCreateForm} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Panier
          </Button>
        </div>
      </div>

      <div className="p-4 lg:px-6 space-y-4 lg:space-y-6">
        {/* Search */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un panier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredCarts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Aucun panier trouvé' : 'Aucun panier préconfiguré'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Commencez par créer votre premier panier'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Mobile view */}
            <div className="lg:hidden space-y-4">
              {filteredCarts.map((cart) => (
                <Card key={cart.id} className="shadow-sm border">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {cart.image && (
                        <img
                          src={cart.image}
                          alt={cart.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{cart.name}</h3>
                            {cart.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{cart.description}</p>
                            )}
                          </div>
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
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
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

                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge variant="secondary">{cart.category}</Badge>
                          {cart.is_featured && <Badge variant="default">En vedette</Badge>}
                          {!cart.is_active && <Badge variant="destructive">Inactif</Badge>}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg text-green-600">
                            {formatPrice(cart.total_price || 0)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {cart.items?.length || 0} produits
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop view */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCarts.map((cart) => (
                <Card key={cart.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {cart.image && (
                      <img
                        src={cart.image}
                        alt={cart.name}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg line-clamp-2 flex-1">{cart.name}</h3>
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
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
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
                        <p className="text-sm text-gray-600 line-clamp-3">{cart.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{cart.category}</Badge>
                        {cart.is_featured && <Badge variant="default">En vedette</Badge>}
                        {!cart.is_active && <Badge variant="destructive">Inactif</Badge>}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-bold text-xl text-green-600">
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
          </>
        )}
      </div>
    </div>
  );
};

export default PreconfiguredCartManagement;

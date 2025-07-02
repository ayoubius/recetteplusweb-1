import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { useUserOrders } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
import { User, Settings, MapPin, Heart, ShoppingBag, Upload, Camera, Package, Eye, Clock, CheckCircle, Truck } from 'lucide-react';
import { formatCFA } from '@/lib/currency';
import OrderDetailsDialog from '@/components/order/OrderDetailsDialog';

const Profile = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { data: userOrders = [], isLoading: ordersLoading } = useUserOrders(currentUser?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  const [profile, setProfile] = useState({
    display_name: currentUser?.user_metadata?.display_name || '',
    email: currentUser?.email || '',
    phone_number: '',
    bio: '',
    location: '',
    date_of_birth: '',
  });

  const handleUpdateProfile = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès."
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          photo_url: data.publicUrl,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;

      toast({
        title: "Avatar mis à jour",
        description: "Votre photo de profil a été mise à jour avec succès."
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et préférences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Commandes</span>
              {userOrders.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {userOrders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Adresses</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Favoris</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
                      {profile.display_name.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-1 hover:bg-orange-600 transition-colors"
                    >
                      <Camera className="h-3 w-3" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-lg">{profile.display_name || 'Utilisateur'}</h3>
                    <p className="text-gray-600">{profile.email}</p>
                    <Badge variant="outline" className="mt-1">
                      Membre depuis {new Date(currentUser?.created_at || '').toLocaleDateString('fr-FR')}
                    </Badge>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Nom d'affichage</Label>
                    <Input
                      id="display_name"
                      value={profile.display_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder="Votre nom d'affichage"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Téléphone</Label>
                    <Input
                      id="phone_number"
                      value={profile.phone_number}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone_number: e.target.value }))}
                      placeholder="+223 XX XX XX XX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date de naissance</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={profile.date_of_birth}
                      onChange={(e) => setProfile(prev => ({ ...prev, date_of_birth: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Bamako, Mali"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Parlez-nous de vous..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
                >
                  {loading ? 'Mise à jour...' : 'Sauvegarder les modifications'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Mes commandes</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : userOrders.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <Card key={order.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium">
                                Commande #{order.id.slice(0, 8).toUpperCase()}
                              </h4>
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
                            <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Total</p>
                              <p className="text-lg font-bold text-orange-600">
                                {formatCFA(order.total_amount)}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-600">Articles</p>
                              <p className="text-sm">
                                {Array.isArray(order.items) ? order.items.length : 0} article(s)
                              </p>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-600">Livraison</p>
                              <p className="text-sm text-gray-700">
                                {order.delivery_fee ? formatCFA(order.delivery_fee) : 'Gratuite'}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewOrderDetails(order)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Voir détails
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune commande pour le moment</p>
                    <p className="text-sm">Vos commandes apparaîtront ici</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Notifications par email</h4>
                      <p className="text-sm text-gray-600">Recevoir des notifications par email</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Newsletter</h4>
                      <p className="text-sm text-gray-600">Recevoir notre newsletter hebdomadaire</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Profil public</h4>
                      <p className="text-sm text-gray-600">Rendre votre profil visible aux autres utilisateurs</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>Mes adresses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    Ajouter une nouvelle adresse
                  </Button>
                  <div className="text-center py-8 text-gray-500">
                    Aucune adresse enregistrée pour le moment
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Mes favoris</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun favori pour le moment</p>
                  <p className="text-sm">Ajoutez des recettes et produits à vos favoris pour les retrouver facilement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isOrderDetailsOpen}
        onClose={() => {
          setIsOrderDetailsOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default Profile;

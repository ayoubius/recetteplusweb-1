
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, Mail, Phone, Calendar, Shield, Trash2, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSupabaseAuthUsers, useDeleteSupabaseAuthUser } from '@/hooks/useSupabaseAuthUsers';
import { useSupabaseUsers, useUpdateSupabaseUser } from '@/hooks/useSupabaseUsers';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: authUsers = [], isLoading: authLoading, refetch: refetchAuthUsers } = useSupabaseAuthUsers();
  const { data: profileUsers = [], isLoading: profileLoading, refetch: refetchProfiles } = useSupabaseUsers();
  const updateUserMutation = useUpdateSupabaseUser();
  const deleteAuthUserMutation = useDeleteSupabaseAuthUser();

  // Fusion des données utilisateur
  const mergedUsers = authUsers.map(authUser => {
    const profile = profileUsers.find(p => p.id === authUser.id);
    return {
      ...authUser,
      profile,
      display_name: profile?.display_name || authUser.email?.split('@')[0] || 'Utilisateur',
      role: profile?.role || 'user',
      photo_url: profile?.photo_url
    };
  });

  const filteredUsers = mergedUsers.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (userId: string, userEmail?: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userEmail}" ? Cette action est irréversible.`)) {
      try {
        await deleteAuthUserMutation.mutateAsync(userId);
        refetchAuthUsers();
        refetchProfiles();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      await updateUserMutation.mutateAsync({
        userId,
        data: { role: 'admin' }
      });
      refetchProfiles();
    } catch (error) {
      console.error('Erreur lors de la promotion:', error);
    }
  };

  const handleDemoteFromAdmin = async (userId: string) => {
    try {
      await updateUserMutation.mutateAsync({
        userId,
        data: { role: 'user' }
      });
      refetchProfiles();
    } catch (error) {
      console.error('Erreur lors de la rétrogradation:', error);
    }
  };

  const isLoading = authLoading || profileLoading;
  const isMutating = updateUserMutation.isPending || deleteAuthUserMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const adminUsers = filteredUsers.filter(user => user.role === 'admin');
  const regularUsers = filteredUsers.filter(user => user.role !== 'admin');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-orange-500" />
            Gestion des utilisateurs
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez tous les utilisateurs de votre plateforme ({filteredUsers.length} utilisateurs au total)
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total utilisateurs</p>
                <p className="text-2xl font-bold">{filteredUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Administrateurs</p>
                <p className="text-2xl font-bold">{adminUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utilisateurs confirmés</p>
                <p className="text-2xl font-bold">
                  {filteredUsers.filter(u => u.email_confirmed_at).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tous ({filteredUsers.length})</TabsTrigger>
              <TabsTrigger value="admins">Administrateurs ({adminUsers.length})</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs ({regularUsers.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <UserTable users={filteredUsers} onDelete={handleDeleteUser} onPromote={handlePromoteToAdmin} onDemote={handleDemoteFromAdmin} isMutating={isMutating} />
            </TabsContent>
            
            <TabsContent value="admins">
              <UserTable users={adminUsers} onDelete={handleDeleteUser} onPromote={handlePromoteToAdmin} onDemote={handleDemoteFromAdmin} isMutating={isMutating} />
            </TabsContent>
            
            <TabsContent value="users">
              <UserTable users={regularUsers} onDelete={handleDeleteUser} onPromote={handlePromoteToAdmin} onDemote={handleDemoteFromAdmin} isMutating={isMutating} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface UserTableProps {
  users: any[];
  onDelete: (id: string, email?: string) => void;
  onPromote: (id: string) => void;
  onDemote: (id: string) => void;
  isMutating: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, onDelete, onPromote, onDemote, isMutating }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Dernière connexion</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                {user.photo_url && (
                  <img 
                    src={user.photo_url} 
                    alt={user.display_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{user.display_name}</p>
                  <p className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                {user.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                {user.email && (
                  <Badge variant={user.email_confirmed_at ? 'default' : 'destructive'} className="text-xs">
                    Email {user.email_confirmed_at ? 'confirmé' : 'non confirmé'}
                  </Badge>
                )}
                {user.phone && (
                  <Badge variant={user.phone_confirmed_at ? 'default' : 'destructive'} className="text-xs">
                    Tél. {user.phone_confirmed_at ? 'confirmé' : 'non confirmé'}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </Badge>
            </TableCell>
            <TableCell>
              {user.last_sign_in_at ? (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-sm">
                    {format(new Date(user.last_sign_in_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                  </span>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Jamais connecté</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {user.role === 'user' ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onPromote(user.id)}
                    disabled={isMutating}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDemote(user.id)}
                    disabled={isMutating}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    User
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete(user.id, user.email || user.phone)}
                  disabled={isMutating}
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserManagement;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Users, Edit, Trash2, Search } from 'lucide-react';
import { useAdminTeamMembers, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember, TeamMember } from '@/hooks/useTeamMembers';
import TeamMemberForm from '@/components/admin/TeamMemberForm';

const TeamMembersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: members = [], isLoading } = useAdminTeamMembers();
  const createMutation = useCreateTeamMember();
  const updateMutation = useUpdateTeamMember();
  const deleteMutation = useDeleteTeamMember();

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setShowForm(false);
        setSelectedMember(null);
      }
    });
  };

  const handleUpdate = (data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    if (selectedMember) {
      updateMutation.mutate({ id: selectedMember.id, ...data }, {
        onSuccess: () => {
          setShowForm(false);
          setSelectedMember(null);
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const openEditForm = (member: TeamMember) => {
    setSelectedMember(member);
    setShowForm(true);
  };

  const openCreateForm = () => {
    setSelectedMember(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <Users className="h-6 w-6 mr-2 text-orange-500" />
              Équipe
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {members.length} membres au total
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
              <Users className="h-8 w-8 mr-3 text-orange-500" />
              Gestion de l'Équipe ({members.length})
            </h1>
          </div>
          <Button onClick={openCreateForm} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Membre
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
                placeholder="Rechercher un membre..."
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
        ) : filteredMembers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Aucun membre trouvé' : 'Aucun membre d\'équipe'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Commencez par ajouter votre premier membre'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Mobile view */}
            <div className="lg:hidden space-y-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="shadow-sm border">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.role}</p>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditForm(member)}
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
                                  <AlertDialogTitle>Supprimer le membre</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer "{member.name}" de l'équipe ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(member.id)}>
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        
                        {member.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{member.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Badge variant={member.is_active ? "default" : "secondary"}>
                            {member.is_active ? "Actif" : "Inactif"}
                          </Badge>
                          {member.display_order !== null && (
                            <span className="text-xs text-gray-400">
                              Ordre: {member.display_order}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop view */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <Users className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg truncate">{member.name}</h3>
                            <p className="text-gray-600">{member.role}</p>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditForm(member)}
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
                                  <AlertDialogTitle>Supprimer le membre</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer "{member.name}" de l'équipe ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(member.id)}>
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        
                        {member.description && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-3">{member.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between mt-4">
                          <Badge variant={member.is_active ? "default" : "secondary"}>
                            {member.is_active ? "Actif" : "Inactif"}
                          </Badge>
                          {member.display_order !== null && (
                            <span className="text-xs text-gray-400">
                              Ordre: {member.display_order}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={closeForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMember ? 'Modifier le membre' : 'Nouveau membre'}
            </DialogTitle>
          </DialogHeader>
          <TeamMemberForm
            member={selectedMember}
            onSubmit={selectedMember ? handleUpdate : handleCreate}
            onCancel={closeForm}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamMembersManagement;

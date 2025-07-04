
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Users, Edit, Trash2, Search } from 'lucide-react';
import { useAdminTeamMembers, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember, TeamMember } from '@/hooks/useTeamMembers';
import TeamMemberForm from '@/components/admin/TeamMemberForm';

const TeamMembersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const { data: members = [], isLoading, refetch } = useAdminTeamMembers();
  const createMutation = useCreateTeamMember();
  const updateMutation = useUpdateTeamMember();
  const deleteMutation = useDeleteTeamMember();

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    await createMutation.mutateAsync(data);
    setShowForm(false);
    refetch();
  };

  const handleUpdate = async (data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingMember) return;
    
    await updateMutation.mutateAsync({
      id: editingMember.id,
      ...data
    });
    setEditingMember(null);
    refetch();
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${name} de l'équipe ?`)) {
      await deleteMutation.mutateAsync(id);
      refetch();
    }
  };

  const openCreateForm = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const openEditForm = (member: TeamMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Users className="h-8 w-8 text-orange-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion de l'Équipe</h1>
            <p className="text-gray-600 mt-2">
              Gérez tous les membres de l'équipe ({members.length} membres)
            </p>
          </div>
        </div>
        <Button onClick={openCreateForm} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Membre
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <CardTitle>Membres de l'équipe</CardTitle>
            <div className="relative flex-1 max-w-sm ml-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un membre..."
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
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Aucun membre trouvé pour cette recherche' : 'Aucun membre d\'équipe trouvé'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold truncate">{member.name}</h3>
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
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(member.id, member.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {member.description && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                            {member.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant={member.is_active ? "default" : "secondary"}>
                            {member.is_active ? "Actif" : "Inactif"}
                          </Badge>
                          {member.display_order && (
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
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={closeForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? 'Modifier le membre' : 'Ajouter un membre'}
            </DialogTitle>
          </DialogHeader>
          <TeamMemberForm
            member={editingMember}
            onSubmit={editingMember ? handleUpdate : handleCreate}
            onCancel={closeForm}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamMembersManagement;

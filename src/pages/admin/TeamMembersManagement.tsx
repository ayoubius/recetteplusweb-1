
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Edit, Trash2, Search } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string | null;
  photo_url: string | null;
  is_active: boolean;
  display_order: number | null;
}

const TeamMembersManagement: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gestion de l'Équipe</h1>
        </div>
        <Button>
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
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
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
    </div>
  );
};

export default TeamMembersManagement;

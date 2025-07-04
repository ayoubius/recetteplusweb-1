
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMember } from '@/hooks/useTeamMembers';
import FileUploadField from './FileUploadField';
import { useSupabaseUpload } from '@/hooks/useSupabaseUpload';

interface TeamMemberFormProps {
  member?: TeamMember | null;
  onSubmit: (data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ member, onSubmit, onCancel, isLoading }) => {
  const { uploadFile, uploading, uploadProgress } = useSupabaseUpload();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: member?.name || '',
    role: member?.role || '',
    description: member?.description || '',
    photo_url: member?.photo_url || '',
    display_order: member?.display_order || 0,
    is_active: member?.is_active ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let photoUrl = formData.photo_url;
    
    // Upload image if selected
    if (selectedImageFile) {
      const uploadedUrl = await uploadFile(selectedImageFile, 'avatars');
      if (uploadedUrl) {
        photoUrl = uploadedUrl;
      }
    }
    
    const cleanData = {
      name: formData.name.trim(),
      role: formData.role.trim(),
      description: formData.description?.trim() || null,
      photo_url: photoUrl || null,
      display_order: formData.display_order,
      is_active: formData.is_active
    };

    onSubmit(cleanData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{member ? 'Modifier le membre' : 'Ajouter un membre'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Poste/Rôle *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                placeholder="ex: Chef cuisinier, Responsable marketing"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Courte biographie ou description du membre..."
              rows={3}
            />
          </div>

          <FileUploadField
            label="Photo du membre"
            value={formData.photo_url}
            onChange={(url) => setFormData({...formData, photo_url: url})}
            onFileSelect={setSelectedImageFile}
            acceptedTypes="image/*"
            uploading={uploading}
            uploadProgress={uploadProgress}
            placeholder="https://exemple.com/photo.jpg"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="display_order">Ordre d'affichage</Label>
              <Input
                id="display_order"
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Membre actif</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={uploading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || uploading}>
              {uploading ? 'Upload en cours...' : isLoading ? 'Enregistrement...' : (member ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TeamMemberForm;

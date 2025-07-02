
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseProfile, useUpdateSupabaseProfile } from '@/hooks/useSupabaseProfiles';
import { useToast } from '@/hooks/use-toast';

const ProfileForm = () => {
  const { currentUser } = useAuth();
  const { data: userProfile, refetch } = useSupabaseProfile(currentUser?.id);
  const updateProfile = useUpdateSupabaseProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    display_name: '',
    phone_number: '',
    bio: '',
    location: '',
    date_of_birth: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        display_name: userProfile.display_name || '',
        phone_number: userProfile.phone_number || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        date_of_birth: userProfile.date_of_birth || '',
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await updateProfile.mutateAsync({
        userId: currentUser.id,
        data: formData
      });
      
      refetch();
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Nom d'affichage</Label>
              <Input
                id="display_name"
                name="display_name"
                value={formData.display_name}
                onChange={handleInputChange}
                placeholder="Votre nom d'affichage"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone_number">Téléphone</Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+223 XX XX XX XX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date de naissance</Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Bamako, Mali"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Parlez-nous de vous..."
              rows={3}
            />
          </div>

          <Button 
            type="submit"
            disabled={updateProfile.isPending}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
          >
            {updateProfile.isPending ? 'Mise à jour...' : 'Sauvegarder les modifications'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;

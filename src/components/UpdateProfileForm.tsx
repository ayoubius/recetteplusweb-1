
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUpdateSupabaseProfile } from '@/hooks/useSupabaseProfiles';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';

interface UpdateProfileFormProps {
  userProfile: any;
  refetch: () => void;
}

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({ userProfile, refetch }) => {
  const { currentUser } = useAuth();
  const updateProfile = useUpdateSupabaseProfile();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const [formValues, setFormValues] = useState({
    displayName: userProfile?.display_name || '',
    photoURL: userProfile?.photo_url || '',
    dietaryRestrictions: userProfile?.preferences?.dietaryRestrictions || [],
    favoriteCategories: userProfile?.preferences?.favoriteCategories || [],
  });

  useEffect(() => {
    if (userProfile) {
      setFormValues({
        displayName: userProfile.display_name || '',
        photoURL: userProfile.photo_url || '',
        dietaryRestrictions: userProfile.preferences?.dietaryRestrictions || [],
        favoriteCategories: userProfile.preferences?.favoriteCategories || [],
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await updateProfile.mutateAsync({
        userId: currentUser.id,
        data: {
          display_name: formValues.displayName,
          photo_url: formValues.photoURL,
          preferences: {
            dietaryRestrictions: formValues.dietaryRestrictions,
            favoriteCategories: formValues.favoriteCategories,
          },
        },
      });
      setIsEditing(false);
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

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nom d'affichage:</Label>
            <p className="font-semibold">{userProfile?.display_name || 'Non défini'}</p>
          </div>
          <div>
            <Label>Email:</Label>
            <p className="font-semibold">{currentUser?.email}</p>
          </div>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          Modifier le profil
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="displayName">Nom d'affichage</Label>
          <Input
            id="displayName"
            name="displayName"
            value={formValues.displayName}
            onChange={handleInputChange}
            placeholder="Votre nom d'affichage"
          />
        </div>
        <div>
          <Label htmlFor="photoURL">Photo de profil (URL)</Label>
          <Input
            id="photoURL"
            name="photoURL"
            value={formValues.photoURL}
            onChange={handleInputChange}
            placeholder="https://exemple.com/photo.jpg"
          />
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default UpdateProfileForm;

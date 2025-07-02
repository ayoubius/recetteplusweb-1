
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { UserProfile } from '@/lib/firestore';

interface UserProfileFormProps {
  user: UserProfile;
  onSubmit: (data: Partial<UserProfile>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ user, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    preferences: {
      dietaryRestrictions: [...(user.preferences?.dietaryRestrictions || [])],
      favoriteCategories: [...(user.preferences?.favoriteCategories || [])]
    }
  });

  const [newRestriction, setNewRestriction] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      displayName: formData.displayName,
      photoURL: formData.photoURL,
      preferences: formData.preferences
    });
  };

  const addRestriction = () => {
    if (newRestriction.trim() && !formData.preferences.dietaryRestrictions.includes(newRestriction.trim())) {
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          dietaryRestrictions: [...formData.preferences.dietaryRestrictions, newRestriction.trim()]
        }
      });
      setNewRestriction('');
    }
  };

  const removeRestriction = (restriction: string) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        dietaryRestrictions: formData.preferences.dietaryRestrictions.filter(r => r !== restriction)
      }
    });
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.preferences.favoriteCategories.includes(newCategory.trim())) {
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          favoriteCategories: [...formData.preferences.favoriteCategories, newCategory.trim()]
        }
      });
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        favoriteCategories: formData.preferences.favoriteCategories.filter(c => c !== category)
      }
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Modifier le profil utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="displayName">Nom d'affichage</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email (lecture seule)</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="photoURL">URL de la photo de profil</Label>
              <Input
                id="photoURL"
                type="url"
                value={formData.photoURL}
                onChange={(e) => setFormData({...formData, photoURL: e.target.value})}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>

          <div>
            <Label>Restrictions alimentaires</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.preferences.dietaryRestrictions.map((restriction) => (
                  <Badge key={restriction} variant="secondary" className="flex items-center gap-1">
                    {restriction}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeRestriction(restriction)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newRestriction}
                  onChange={(e) => setNewRestriction(e.target.value)}
                  placeholder="Ajouter une restriction"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRestriction())}
                />
                <Button type="button" variant="outline" onClick={addRestriction}>
                  Ajouter
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Catégories favorites</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.preferences.favoriteCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeCategory(category)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Ajouter une catégorie"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                />
                <Button type="button" variant="outline" onClick={addCategory}>
                  Ajouter
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;

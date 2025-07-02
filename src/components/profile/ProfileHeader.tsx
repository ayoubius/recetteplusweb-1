
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseProfile } from '@/hooks/useSupabaseProfiles';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ProfileHeader = () => {
  const { currentUser } = useAuth();
  const { data: userProfile } = useSupabaseProfile(currentUser?.id);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

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
    }
  };

  const getAvatarDisplay = () => {
    if (userProfile?.photo_url) {
      return (
        <img 
          src={userProfile.photo_url} 
          alt="Avatar" 
          className="w-20 h-20 rounded-full object-cover"
        />
      );
    }
    
    const initial = userProfile?.display_name?.charAt(0).toUpperCase() || 
                   currentUser?.email?.charAt(0).toUpperCase() || 'U';
    
    return (
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
        {initial}
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
      <div className="relative">
        {getAvatarDisplay()}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-2 hover:bg-orange-600 transition-colors shadow-lg"
        >
          <Camera className="h-4 w-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />
      </div>
      
      <div className="text-center sm:text-left flex-1">
        <h2 className="text-2xl font-bold text-gray-900">
          {userProfile?.display_name || 'Utilisateur'}
        </h2>
        <p className="text-gray-600 mb-2">{currentUser?.email}</p>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          <Badge variant="outline">
            Membre depuis {new Date(currentUser?.created_at || '').toLocaleDateString('fr-FR')}
          </Badge>
          {userProfile?.role && userProfile.role !== 'user' && (
            <Badge variant="secondary" className="capitalize">
              {userProfile.role}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

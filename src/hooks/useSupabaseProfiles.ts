
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseProfile {
  id: string;
  email?: string;
  display_name?: string;
  photo_url?: string;
  phone_number?: string;
  bio?: string;
  location?: string;
  date_of_birth?: string;
  role: 'user' | 'admin' | 'manager' | 'marketing_manager' | 'content_creator' | 'admin_assistant' | 'order_validator' | 'delivery_person';
  preferences?: {
    dietaryRestrictions: string[];
    favoriteCategories: string[];
    newsletter_enabled?: boolean;
  };
  notification_settings?: {
    email_notifications?: boolean;
    push_notifications?: boolean;
    marketing_emails?: boolean;
    weekly_digest?: boolean;
    recipe_updates?: boolean;
    product_updates?: boolean;
  };
  privacy_settings?: {
    profile_visibility?: string;
    email_visibility?: string;
    phone_visibility?: string;
    location_visibility?: string;
    activity_visibility?: string;
    allow_friend_requests?: boolean;
    allow_messages?: boolean;
    show_online_status?: boolean;
  };
  created_at: string;
  updated_at: string;
}

export const useSupabaseProfile = (userId?: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['supabase-profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        
        // Safely transform the data to match our interface
        const profile: SupabaseProfile = {
          id: data.id,
          email: data.email,
          display_name: data.display_name,
          photo_url: data.photo_url,
          phone_number: data.phone_number,
          bio: data.bio,
          location: data.location,
          date_of_birth: data.date_of_birth,
          role: (data.role as SupabaseProfile['role']) || 'user',
          preferences: data.preferences && typeof data.preferences === 'object' && !Array.isArray(data.preferences) ? {
            dietaryRestrictions: (data.preferences as any).dietaryRestrictions || [],
            favoriteCategories: (data.preferences as any).favoriteCategories || [],
            newsletter_enabled: (data.preferences as any).newsletter_enabled
          } : {
            dietaryRestrictions: [],
            favoriteCategories: []
          },
          notification_settings: data.notification_settings && typeof data.notification_settings === 'object' ? {
            email_notifications: (data.notification_settings as any).email_notifications ?? true,
            push_notifications: (data.notification_settings as any).push_notifications ?? true,
            marketing_emails: (data.notification_settings as any).marketing_emails ?? false,
            weekly_digest: (data.notification_settings as any).weekly_digest ?? true,
            recipe_updates: (data.notification_settings as any).recipe_updates ?? true,
            product_updates: (data.notification_settings as any).product_updates ?? true
          } : {
            email_notifications: true,
            push_notifications: true,
            marketing_emails: false,
            weekly_digest: true,
            recipe_updates: true,
            product_updates: true
          },
          privacy_settings: data.privacy_settings && typeof data.privacy_settings === 'object' ? {
            profile_visibility: (data.privacy_settings as any).profile_visibility || 'public',
            email_visibility: (data.privacy_settings as any).email_visibility || 'private',
            phone_visibility: (data.privacy_settings as any).phone_visibility || 'private',
            location_visibility: (data.privacy_settings as any).location_visibility || 'public',
            activity_visibility: (data.privacy_settings as any).activity_visibility || 'public',
            allow_friend_requests: (data.privacy_settings as any).allow_friend_requests ?? true,
            allow_messages: (data.privacy_settings as any).allow_messages ?? true,
            show_online_status: (data.privacy_settings as any).show_online_status ?? true
          } : {
            profile_visibility: 'public',
            email_visibility: 'private',
            phone_visibility: 'private',
            location_visibility: 'public',
            activity_visibility: 'public',
            allow_friend_requests: true,
            allow_messages: true,
            show_online_status: true
          },
          created_at: data.created_at,
          updated_at: data.updated_at
        };

        return profile;
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de récupérer le profil.",
          variant: "destructive"
        });
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    retry: 2
  });
};

export const useUpdateSupabaseProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, data }: { 
      userId: string; 
      data: Partial<SupabaseProfile>
    }) => {
      const updateData: any = {};
      
      // Only include fields that exist in the database
      if (data.display_name !== undefined) updateData.display_name = data.display_name;
      if (data.phone_number !== undefined) updateData.phone_number = data.phone_number;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.location !== undefined) updateData.location = data.location;
      if (data.date_of_birth !== undefined) updateData.date_of_birth = data.date_of_birth;
      if (data.preferences !== undefined) updateData.preferences = data.preferences;
      if (data.notification_settings !== undefined) updateData.notification_settings = data.notification_settings;
      if (data.privacy_settings !== undefined) updateData.privacy_settings = data.privacy_settings;
      
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['supabase-profile', variables.userId] });
      toast({
        title: "Profil modifié",
        description: "Vos informations ont été mises à jour avec succès."
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le profil.",
        variant: "destructive"
      });
    }
  });
};

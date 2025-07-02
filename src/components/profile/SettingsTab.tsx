
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseProfile, useUpdateSupabaseProfile } from '@/hooks/useSupabaseProfiles';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  email_notifications?: boolean;
  push_notifications?: boolean;
  marketing_emails?: boolean;
  newsletter_enabled?: boolean;
}

const SettingsTab = () => {
  const { currentUser } = useAuth();
  const { data: userProfile } = useSupabaseProfile(currentUser?.id);
  const updateProfile = useUpdateSupabaseProfile();
  const { toast } = useToast();

  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    newsletter_enabled: false
  });

  useEffect(() => {
    if (userProfile?.preferences) {
      setSettings({
        email_notifications: userProfile.notification_settings?.email_notifications ?? true,
        push_notifications: userProfile.notification_settings?.push_notifications ?? true,
        marketing_emails: userProfile.notification_settings?.marketing_emails ?? false,
        newsletter_enabled: userProfile.preferences.newsletter_enabled ?? false
      });
    }
  }, [userProfile]);

  const handleSettingChange = async (key: keyof NotificationSettings, value: boolean) => {
    if (!currentUser) return;

    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      const updatedPreferences = {
        ...userProfile?.preferences,
        newsletter_enabled: newSettings.newsletter_enabled
      };

      const updatedNotificationSettings = {
        ...userProfile?.notification_settings,
        email_notifications: newSettings.email_notifications,
        push_notifications: newSettings.push_notifications,
        marketing_emails: newSettings.marketing_emails
      };

      await updateProfile.mutateAsync({
        userId: currentUser.id,
        data: {
          preferences: updatedPreferences,
          notification_settings: updatedNotificationSettings
        }
      });

      toast({
        title: "Paramètres mis à jour",
        description: "Vos préférences ont été sauvegardées."
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres du compte</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="email-notifications" className="text-base font-medium">
                  Notifications par email
                </Label>
                <p className="text-sm text-gray-600">
                  Recevoir des notifications importantes par email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.email_notifications}
                onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="push-notifications" className="text-base font-medium">
                  Notifications push
                </Label>
                <p className="text-sm text-gray-600">
                  Recevoir des notifications push sur votre navigateur
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.push_notifications}
                onCheckedChange={(checked) => handleSettingChange('push_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="newsletter" className="text-base font-medium">
                  Newsletter
                </Label>
                <p className="text-sm text-gray-600">
                  Recevoir notre newsletter avec les dernières recettes
                </p>
              </div>
              <Switch
                id="newsletter"
                checked={settings.newsletter_enabled}
                onCheckedChange={(checked) => handleSettingChange('newsletter_enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="marketing" className="text-base font-medium">
                  Emails marketing
                </Label>
                <p className="text-sm text-gray-600">
                  Recevoir des offres promotionnelles et nouveautés
                </p>
              </div>
              <Switch
                id="marketing"
                checked={settings.marketing_emails}
                onCheckedChange={(checked) => handleSettingChange('marketing_emails', checked)}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Zone dangereuse</h3>
            <Button variant="destructive" className="w-full sm:w-auto">
              Supprimer mon compte
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;

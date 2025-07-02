
-- Créer les politiques RLS pour la table admin_permissions
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres permissions
CREATE POLICY "Users can view their own admin permissions" 
  ON public.admin_permissions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politique pour permettre aux super admins de voir toutes les permissions
CREATE POLICY "Super admins can view all admin permissions" 
  ON public.admin_permissions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_permissions 
      WHERE user_id = auth.uid() AND is_super_admin = true
    )
  );

-- Politique pour permettre aux super admins de modifier les permissions
CREATE POLICY "Super admins can manage admin permissions" 
  ON public.admin_permissions 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_permissions 
      WHERE user_id = auth.uid() AND is_super_admin = true
    )
  );

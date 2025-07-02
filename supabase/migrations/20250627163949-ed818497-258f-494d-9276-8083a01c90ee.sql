
-- Supprimer TOUTES les politiques existantes sur admin_permissions
DROP POLICY IF EXISTS "Users can view their own admin permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Super admins can view all permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Super admins can manage permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Users can view their own permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Super admins can view all admin permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Super admins can manage admin permissions" ON public.admin_permissions;

-- Créer des politiques RLS sécurisées sans récursion
CREATE POLICY "Users can view their own admin permissions" 
  ON public.admin_permissions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all admin permissions" 
  ON public.admin_permissions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Super admins can manage admin permissions" 
  ON public.admin_permissions 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

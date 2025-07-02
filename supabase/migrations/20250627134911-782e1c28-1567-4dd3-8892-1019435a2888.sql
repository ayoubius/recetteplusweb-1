
-- Créer une table pour les permissions d'administration
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  can_manage_users BOOLEAN DEFAULT false,
  can_manage_products BOOLEAN DEFAULT false,
  can_manage_recipes BOOLEAN DEFAULT false,
  can_manage_videos BOOLEAN DEFAULT false,
  can_manage_categories BOOLEAN DEFAULT false,
  can_manage_orders BOOLEAN DEFAULT false,
  is_super_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Activer RLS pour la table admin_permissions
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux super admins de voir toutes les permissions
CREATE POLICY "Super admins can view all permissions" 
  ON public.admin_permissions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_permissions ap 
      WHERE ap.user_id = auth.uid() AND ap.is_super_admin = true
    )
  );

-- Politique pour permettre aux super admins de modifier les permissions
CREATE POLICY "Super admins can manage permissions" 
  ON public.admin_permissions 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_permissions ap 
      WHERE ap.user_id = auth.uid() AND ap.is_super_admin = true
    )
  );

-- Politique pour permettre aux utilisateurs de voir leurs propres permissions
CREATE POLICY "Users can view their own permissions" 
  ON public.admin_permissions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Créer une table pour les catégories de produits gérables
CREATE TABLE IF NOT EXISTS public.manageable_product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS pour la table manageable_product_categories
ALTER TABLE public.manageable_product_categories ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous de lire les catégories actives
CREATE POLICY "Anyone can view active categories" 
  ON public.manageable_product_categories 
  FOR SELECT 
  USING (is_active = true);

-- Politique pour permettre aux admins de gérer les catégories
CREATE POLICY "Admins can manage categories" 
  ON public.manageable_product_categories 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_permissions ap 
      WHERE ap.user_id = auth.uid() 
      AND (ap.can_manage_categories = true OR ap.is_super_admin = true)
    )
  );

-- Créer une table pour les catégories de recettes gérables
CREATE TABLE IF NOT EXISTS public.manageable_recipe_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS pour la table manageable_recipe_categories
ALTER TABLE public.manageable_recipe_categories ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous de lire les catégories actives
CREATE POLICY "Anyone can view active recipe categories" 
  ON public.manageable_recipe_categories 
  FOR SELECT 
  USING (is_active = true);

-- Politique pour permettre aux admins de gérer les catégories de recettes
CREATE POLICY "Admins can manage recipe categories" 
  ON public.manageable_recipe_categories 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_permissions ap 
      WHERE ap.user_id = auth.uid() 
      AND (ap.can_manage_categories = true OR ap.is_super_admin = true)
    )
  );

-- Insérer quelques catégories de produits par défaut (seulement si elles n'existent pas)
INSERT INTO public.manageable_product_categories (name, description, display_order) 
SELECT * FROM (VALUES
  ('Légumes', 'Légumes frais et variés', 1),
  ('Fruits', 'Fruits de saison', 2),
  ('Viandes', 'Viandes fraîches', 3),
  ('Poissons', 'Poissons et fruits de mer', 4),
  ('Céréales', 'Céréales et grains', 5),
  ('Légumineuses', 'Haricots, lentilles, pois chiches', 6),
  ('Épices', 'Épices et condiments', 7),
  ('Herbes', 'Herbes fraîches et séchées', 8),
  ('Huiles', 'Huiles de cuisine', 9),
  ('Produits laitiers', 'Lait, fromage, yaourt', 10)
) AS v(name, description, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.manageable_product_categories WHERE name = v.name);

-- Insérer quelques catégories de recettes par défaut (seulement si elles n'existent pas)
INSERT INTO public.manageable_recipe_categories (name, description, display_order)
SELECT * FROM (VALUES
  ('Plats traditionnels maliens', 'Recettes traditionnelles du Mali', 1),
  ('Soupes et potages', 'Soupes chaudes et froides', 2),
  ('Riz et céréales', 'Plats à base de riz et céréales', 3),
  ('Viandes grillées', 'Grillades et barbecue', 4),
  ('Poissons', 'Plats de poisson', 5),
  ('Légumes sautés', 'Légumes préparés', 6),
  ('Sauces', 'Sauces et accompagnements', 7),
  ('Desserts', 'Desserts et sucreries', 8),
  ('Boissons', 'Boissons chaudes et froides', 9),
  ('Petit-déjeuner', 'Plats pour le matin', 10)
) AS v(name, description, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.manageable_recipe_categories WHERE name = v.name);

-- Créer une fonction pour vérifier les permissions d'administration
CREATE OR REPLACE FUNCTION public.has_admin_permission(permission_type TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND (
      is_super_admin = true OR
      CASE permission_type
        WHEN 'users' THEN can_manage_users = true
        WHEN 'products' THEN can_manage_products = true
        WHEN 'recipes' THEN can_manage_recipes = true
        WHEN 'videos' THEN can_manage_videos = true
        WHEN 'categories' THEN can_manage_categories = true
        WHEN 'orders' THEN can_manage_orders = true
        ELSE false
      END
    )
  );
END;
$$;

-- Mettre à jour la fonction is_admin existante pour utiliser la nouvelle table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND (is_super_admin = true OR 
         can_manage_users = true OR 
         can_manage_products = true OR 
         can_manage_recipes = true OR 
         can_manage_videos = true OR 
         can_manage_categories = true OR 
         can_manage_orders = true)
  );
END;
$$;

-- Ajouter des politiques pour le bucket videos existant (si elles n'existent pas déjà)
DO $$
BEGIN
  -- Vérifier si les politiques existent déjà avant de les créer
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can upload videos'
  ) THEN
    CREATE POLICY "Admins can upload videos" 
      ON storage.objects 
      FOR INSERT 
      WITH CHECK (
        bucket_id = 'videos' AND 
        EXISTS (
          SELECT 1 FROM public.admin_permissions ap 
          WHERE ap.user_id = auth.uid() 
          AND (ap.can_manage_videos = true OR ap.is_super_admin = true)
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view videos'
  ) THEN
    CREATE POLICY "Anyone can view videos" 
      ON storage.objects 
      FOR SELECT 
      USING (bucket_id = 'videos');
  END IF;
END $$;


-- Suppression des politiques problématiques
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage all recipes" ON public.recipes;
DROP POLICY IF EXISTS "Admins can manage all videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can manage all favorites" ON public.favorites;
DROP POLICY IF EXISTS "Admins can manage all cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Admins can manage all recipe carts" ON public.recipe_carts;
DROP POLICY IF EXISTS "Admins can manage preconfigured carts" ON public.preconfigured_carts;
DROP POLICY IF EXISTS "Admins can manage product categories" ON public.product_categories;
DROP POLICY IF EXISTS "Admins can manage recipe categories" ON public.recipe_categories;

-- Création d'une fonction sécurisée pour vérifier le rôle admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recréation des politiques sans récursion
CREATE POLICY "Admins can manage all profiles" ON public.profiles 
FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage products" ON public.products 
FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage all recipes" ON public.recipes 
FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage all videos" ON public.videos 
FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage all favorites" ON public.favorites 
FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage all cart items" ON public.cart_items 
FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage all recipe carts" ON public.recipe_carts 
FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage preconfigured carts" ON public.preconfigured_carts 
FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage product categories" ON public.product_categories 
FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage recipe categories" ON public.recipe_categories 
FOR ALL USING (public.is_admin());

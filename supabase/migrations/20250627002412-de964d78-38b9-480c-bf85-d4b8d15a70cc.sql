
-- Mise à jour des politiques RLS pour permettre aux admins de gérer toutes les données

-- Politiques pour les utilisateurs (profiles)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (
  EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour les produits
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
  EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour les recettes
DROP POLICY IF EXISTS "Anyone can view recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can create recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can update own recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can delete own recipes" ON public.recipes;
DROP POLICY IF EXISTS "Admins can manage all recipes" ON public.recipes;

CREATE POLICY "Anyone can view recipes" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Users can create recipes" ON public.recipes FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own recipes" ON public.recipes FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own recipes" ON public.recipes FOR DELETE USING (auth.uid() = created_by);
CREATE POLICY "Admins can manage all recipes" ON public.recipes FOR ALL USING (
  EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour les vidéos
DROP POLICY IF EXISTS "Anyone can view videos" ON public.videos;
DROP POLICY IF EXISTS "Users can create videos" ON public.videos;
DROP POLICY IF EXISTS "Users can update own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can delete own videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can manage all videos" ON public.videos;

CREATE POLICY "Anyone can view videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Users can create videos" ON public.videos FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own videos" ON public.videos FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own videos" ON public.videos FOR DELETE USING (auth.uid() = created_by);
CREATE POLICY "Admins can manage all videos" ON public.videos FOR ALL USING (
  EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour les favoris
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;

CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all favorites" ON public.favorites FOR ALL USING (
  EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour les éléments du panier
DROP POLICY IF EXISTS "Users can view own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can manage own cart items" ON public.cart_items;

CREATE POLICY "Users can view own cart items" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cart items" ON public.cart_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all cart items" ON public.cart_items FOR ALL USING (
  EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour les paniers de recettes
DROP POLICY IF EXISTS "Users can view own recipe carts" ON public.recipe_carts;
DROP POLICY IF EXISTS "Users can manage own recipe carts" ON public.recipe_carts;

CREATE POLICY "Users can view own recipe carts" ON public.recipe_carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own recipe carts" ON public.recipe_carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all recipe carts" ON public.recipe_carts FOR ALL USING (
  EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour les paniers préconfigurés
DROP POLICY IF EXISTS "Anyone can view active preconfigured carts" ON public.preconfigured_carts;
DROP POLICY IF EXISTS "Admins can manage preconfigured carts" ON public.preconfigured_carts;

CREATE POLICY "Anyone can view active preconfigured carts" ON public.preconfigured_carts FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage preconfigured carts" ON public.preconfigured_carts FOR ALL USING (
  EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

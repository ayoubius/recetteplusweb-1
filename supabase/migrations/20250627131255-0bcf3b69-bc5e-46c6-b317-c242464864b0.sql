
-- Créer une table pour les paniers principaux des utilisateurs
CREATE TABLE public.user_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  total_price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer une table pour les éléments du panier principal
CREATE TABLE public.user_cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_cart_id UUID NOT NULL REFERENCES public.user_carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC NOT NULL,
  cart_type TEXT NOT NULL CHECK (cart_type IN ('personal', 'recipe', 'preconfigured')),
  source_cart_id UUID, -- ID du panier source (panier recette, panier précconfiguré, etc.)
  source_cart_name TEXT, -- Nom du panier source pour affichage
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer une table pour les paniers recette
CREATE TABLE public.recipe_user_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id),
  cart_name TEXT NOT NULL,
  is_added_to_main_cart BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer une table pour les éléments des paniers recette
CREATE TABLE public.recipe_cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_cart_id UUID NOT NULL REFERENCES public.recipe_user_carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer une table pour les paniers personnalisés
CREATE TABLE public.personal_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  is_added_to_main_cart BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer une table pour les éléments des paniers personnalisés
CREATE TABLE public.personal_cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  personal_cart_id UUID NOT NULL REFERENCES public.personal_carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mettre à jour la table preconfigured_carts pour supporter les paniers en vedette
ALTER TABLE public.preconfigured_carts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.preconfigured_carts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Général';
ALTER TABLE public.preconfigured_carts ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.preconfigured_carts ADD COLUMN IF NOT EXISTS total_price NUMERIC DEFAULT 0;

-- Créer une table pour les paniers préconfigurés ajoutés par les utilisateurs
CREATE TABLE public.user_preconfigured_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  preconfigured_cart_id UUID NOT NULL REFERENCES public.preconfigured_carts(id),
  is_added_to_main_cart BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.user_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_user_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preconfigured_carts ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour user_carts
CREATE POLICY "Users can view their own main cart" ON public.user_carts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own main cart" ON public.user_carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own main cart" ON public.user_carts
  FOR UPDATE USING (auth.uid() = user_id);

-- Politiques RLS pour user_cart_items
CREATE POLICY "Users can view their own main cart items" ON public.user_cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_carts 
      WHERE id = user_cart_items.user_cart_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own main cart items" ON public.user_cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_carts 
      WHERE id = user_cart_items.user_cart_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own main cart items" ON public.user_cart_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_carts 
      WHERE id = user_cart_items.user_cart_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own main cart items" ON public.user_cart_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_carts 
      WHERE id = user_cart_items.user_cart_id AND user_id = auth.uid()
    )
  );

-- Politiques RLS pour recipe_user_carts
CREATE POLICY "Users can view their own recipe carts" ON public.recipe_user_carts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recipe carts" ON public.recipe_user_carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipe carts" ON public.recipe_user_carts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipe carts" ON public.recipe_user_carts
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour recipe_cart_items
CREATE POLICY "Users can view their own recipe cart items" ON public.recipe_cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.recipe_user_carts 
      WHERE id = recipe_cart_items.recipe_cart_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own recipe cart items" ON public.recipe_cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.recipe_user_carts 
      WHERE id = recipe_cart_items.recipe_cart_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own recipe cart items" ON public.recipe_cart_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.recipe_user_carts 
      WHERE id = recipe_cart_items.recipe_cart_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own recipe cart items" ON public.recipe_cart_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.recipe_user_carts 
      WHERE id = recipe_cart_items.recipe_cart_id AND user_id = auth.uid()
    )
  );

-- Politiques RLS pour personal_carts
CREATE POLICY "Users can view their own personal cart" ON public.personal_carts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own personal cart" ON public.personal_carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personal cart" ON public.personal_carts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own personal cart" ON public.personal_carts
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour personal_cart_items
CREATE POLICY "Users can view their own personal cart items" ON public.personal_cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.personal_carts 
      WHERE id = personal_cart_items.personal_cart_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own personal cart items" ON public.personal_cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.personal_carts 
      WHERE id = personal_cart_items.personal_cart_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own personal cart items" ON public.personal_cart_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.personal_carts 
      WHERE id = personal_cart_items.personal_cart_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own personal cart items" ON public.personal_cart_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.personal_carts 
      WHERE id = personal_cart_items.personal_cart_id AND user_id = auth.uid()
    )
  );

-- Politiques RLS pour user_preconfigured_carts
CREATE POLICY "Users can view their own preconfigured carts" ON public.user_preconfigured_carts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preconfigured carts" ON public.user_preconfigured_carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preconfigured carts" ON public.user_preconfigured_carts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preconfigured carts" ON public.user_preconfigured_carts
  FOR DELETE USING (auth.uid() = user_id);

-- Politique pour permettre à tous de voir les paniers préconfigurés
CREATE POLICY "Everyone can view active preconfigured carts" ON public.preconfigured_carts
  FOR SELECT USING (is_active = true);

-- Politique pour les admins et gestionnaires de recettes
CREATE POLICY "Admins and recipe managers can manage preconfigured carts" ON public.preconfigured_carts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'recipe_manager')
    )
  );

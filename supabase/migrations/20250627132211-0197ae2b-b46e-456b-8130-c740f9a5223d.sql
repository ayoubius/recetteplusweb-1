
-- Modifier la table user_cart_items pour supporter les paniers entiers
ALTER TABLE public.user_cart_items 
DROP COLUMN IF EXISTS product_id,
DROP COLUMN IF EXISTS quantity,
DROP COLUMN IF EXISTS unit_price;

-- Ajouter les nouvelles colonnes pour référencer les paniers entiers
ALTER TABLE public.user_cart_items 
ADD COLUMN cart_reference_type TEXT NOT NULL CHECK (cart_reference_type IN ('personal', 'recipe', 'preconfigured')),
ADD COLUMN cart_reference_id UUID NOT NULL,
ADD COLUMN cart_name TEXT NOT NULL,
ADD COLUMN cart_total_price NUMERIC DEFAULT 0,
ADD COLUMN items_count INTEGER DEFAULT 0;

-- Supprimer les anciennes contraintes de colonnes qui n'existent plus
ALTER TABLE public.user_cart_items 
DROP COLUMN IF EXISTS cart_type;

-- Renommer source_cart_id et source_cart_name qui sont maintenant redondants
ALTER TABLE public.user_cart_items 
DROP COLUMN IF EXISTS source_cart_id,
DROP COLUMN IF EXISTS source_cart_name;

-- Mettre à jour les politiques RLS pour la nouvelle structure
DROP POLICY IF EXISTS "Users can view their own main cart items" ON public.user_cart_items;
DROP POLICY IF EXISTS "Users can create their own main cart items" ON public.user_cart_items;
DROP POLICY IF EXISTS "Users can update their own main cart items" ON public.user_cart_items;
DROP POLICY IF EXISTS "Users can delete their own main cart items" ON public.user_cart_items;

-- Recréer les politiques avec la nouvelle structure
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

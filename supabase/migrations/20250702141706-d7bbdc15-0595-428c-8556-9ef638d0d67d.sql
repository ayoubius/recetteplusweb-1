
-- Supprimer les colonnes is_added_to_main_cart qui ne sont plus nécessaires
ALTER TABLE public.personal_carts DROP COLUMN IF EXISTS is_added_to_main_cart;
ALTER TABLE public.recipe_user_carts DROP COLUMN IF EXISTS is_added_to_main_cart;  
ALTER TABLE public.user_preconfigured_carts DROP COLUMN IF EXISTS is_added_to_main_cart;

-- Modifier la table user_cart_items pour simplifier la structure
-- Supprimer les colonnes qui ne sont plus nécessaires
ALTER TABLE public.user_cart_items 
DROP COLUMN IF EXISTS cart_reference_type,
DROP COLUMN IF EXISTS cart_reference_id,
DROP COLUMN IF EXISTS cart_name,
DROP COLUMN IF EXISTS cart_total_price,
DROP COLUMN IF EXISTS items_count;

-- Créer une vue qui combine automatiquement tous les paniers de l'utilisateur
CREATE OR REPLACE VIEW public.user_main_cart_view AS
WITH personal_cart_data AS (
  SELECT 
    pc.user_id,
    'personal' as cart_type,
    pc.id as cart_id,
    'Panier Personnel' as cart_name,
    pci.id as item_id,
    pci.product_id,
    pci.quantity,
    p.name as product_name,
    p.price as unit_price,
    (pci.quantity * p.price) as total_price
  FROM personal_carts pc
  JOIN personal_cart_items pci ON pc.id = pci.personal_cart_id
  JOIN products p ON pci.product_id = p.id
),
recipe_cart_data AS (
  SELECT 
    ruc.user_id,
    'recipe' as cart_type,
    ruc.id as cart_id,
    ruc.cart_name,
    rci.id as item_id,
    rci.product_id,
    rci.quantity,
    p.name as product_name,
    p.price as unit_price,
    (rci.quantity * p.price) as total_price
  FROM recipe_user_carts ruc
  JOIN recipe_cart_items rci ON ruc.id = rci.recipe_cart_id
  JOIN products p ON rci.product_id = p.id
),
preconfigured_cart_data AS (
  SELECT 
    upc.user_id,
    'preconfigured' as cart_type,
    upc.id as cart_id,
    pc.name as cart_name,
    upc.id as item_id, -- Utiliser l'ID du user_preconfigured_cart comme item_id
    NULL as product_id, -- Les paniers préconfigurés n'ont pas de product_id unique
    1 as quantity, -- Quantité fixe de 1 pour le panier entier
    pc.name as product_name,
    pc.total_price as unit_price,
    pc.total_price as total_price
  FROM user_preconfigured_carts upc
  JOIN preconfigured_carts pc ON upc.preconfigured_cart_id = pc.id
)
SELECT * FROM personal_cart_data
UNION ALL
SELECT * FROM recipe_cart_data
UNION ALL
SELECT * FROM preconfigured_cart_data;

-- Créer une fonction pour obtenir le total du panier principal d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_main_cart_total(user_uuid uuid)
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(SUM(total_price), 0)
  FROM public.user_main_cart_view
  WHERE user_id = user_uuid;
$$;

-- Créer une fonction pour obtenir le nombre d'items dans le panier principal
CREATE OR REPLACE FUNCTION public.get_user_main_cart_items_count(user_uuid uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(COUNT(*), 0)::integer
  FROM public.user_main_cart_view
  WHERE user_id = user_uuid;
$$;

-- Accorder les permissions sur la vue
GRANT SELECT ON public.user_main_cart_view TO authenticated;

-- Créer une politique RLS pour la vue
CREATE POLICY "Users can view their own main cart data" ON public.user_main_cart_view
  FOR SELECT USING (auth.uid() = user_id);

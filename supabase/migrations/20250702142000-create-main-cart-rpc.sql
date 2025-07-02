
-- Fonction pour récupérer les données du panier principal de l'utilisateur
CREATE OR REPLACE FUNCTION public.get_user_main_cart_data(user_uuid uuid)
RETURNS TABLE (
  user_id uuid,
  cart_type text,
  cart_id uuid,
  cart_name text,
  item_id uuid,
  product_id uuid,
  quantity integer,
  product_name text,
  unit_price numeric,
  total_price numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH personal_cart_data AS (
    SELECT 
      pc.user_id,
      'personal'::text as cart_type,
      pc.id as cart_id,
      'Panier Personnel'::text as cart_name,
      pci.id as item_id,
      pci.product_id,
      pci.quantity,
      p.name as product_name,
      p.price as unit_price,
      (pci.quantity * p.price) as total_price
    FROM personal_carts pc
    JOIN personal_cart_items pci ON pc.id = pci.personal_cart_id
    JOIN products p ON pci.product_id = p.id
    WHERE pc.user_id = user_uuid
  ),
  recipe_cart_data AS (
    SELECT 
      ruc.user_id,
      'recipe'::text as cart_type,
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
    WHERE ruc.user_id = user_uuid
  ),
  preconfigured_cart_data AS (
    SELECT 
      upc.user_id,
      'preconfigured'::text as cart_type,
      upc.id as cart_id,
      pc.name as cart_name,
      upc.id as item_id,
      NULL::uuid as product_id,
      1 as quantity,
      pc.name as product_name,
      pc.total_price as unit_price,
      pc.total_price as total_price
    FROM user_preconfigured_carts upc
    JOIN preconfigured_carts pc ON upc.preconfigured_cart_id = pc.id
    WHERE upc.user_id = user_uuid
  )
  SELECT * FROM personal_cart_data
  UNION ALL
  SELECT * FROM recipe_cart_data
  UNION ALL
  SELECT * FROM preconfigured_cart_data;
END;
$$;

-- Accorder les permissions sur la fonction
GRANT EXECUTE ON FUNCTION public.get_user_main_cart_data(uuid) TO authenticated;

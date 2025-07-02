
-- Vérifier et mettre à jour la table orders pour s'assurer qu'elle a tous les champs nécessaires
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_latitude text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_longitude text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_notes text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee numeric DEFAULT 1000;

-- Créer une fonction pour générer un lien Google Maps
CREATE OR REPLACE FUNCTION generate_google_maps_link(lat text, lng text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  IF lat IS NULL OR lng IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN 'https://www.google.com/maps?q=' || lat || ',' || lng;
END;
$$;

-- Ajouter une colonne pour stocker le lien Google Maps dans les commandes
ALTER TABLE orders ADD COLUMN IF NOT EXISTS google_maps_link text;

-- Créer un trigger pour générer automatiquement le lien Google Maps
CREATE OR REPLACE FUNCTION update_google_maps_link()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.google_maps_link = generate_google_maps_link(NEW.delivery_latitude, NEW.delivery_longitude);
  RETURN NEW;
END;
$$;

-- Créer le trigger
DROP TRIGGER IF EXISTS orders_google_maps_trigger ON orders;
CREATE TRIGGER orders_google_maps_trigger
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_google_maps_link();

-- S'assurer que la table recipes a bien une relation avec les produits dans les ingrédients
-- Les ingrédients doivent référencer des product_id existants

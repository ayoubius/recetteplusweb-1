
-- Ajouter un champ pour indiquer si un panier est pour une occasion spéciale
ALTER TABLE public.preconfigured_carts 
ADD COLUMN is_occasion BOOLEAN DEFAULT FALSE;

-- Mettre à jour quelques paniers existants pour les tests
-- (vous pouvez ajuster ces données selon vos besoins)
UPDATE public.preconfigured_carts 
SET is_occasion = TRUE 
WHERE name ILIKE '%mariage%' OR name ILIKE '%fête%' OR name ILIKE '%anniversaire%' OR name ILIKE '%noël%' OR name ILIKE '%ramadan%';

-- Créer un panier Vegan comme exemple de panier non-occasion
INSERT INTO public.preconfigured_carts (name, description, category, total_price, is_featured, is_active, is_occasion, image)
VALUES (
  'Panier Vegan',
  'Une sélection complète de produits végétaliens pour une alimentation saine et équilibrée',
  'Végétalien',
  15000,
  TRUE,
  TRUE,
  FALSE,
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500'
)
ON CONFLICT DO NOTHING;

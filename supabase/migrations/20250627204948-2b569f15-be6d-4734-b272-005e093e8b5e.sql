
-- Ajouter le champ is_active aux tables de catégories existantes si elles n'existent pas déjà
-- Pour les catégories de produits statiques
ALTER TABLE public.product_categories 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Pour les catégories de recettes statiques  
ALTER TABLE public.recipe_categories 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Mettre à jour toutes les catégories existantes pour qu'elles soient actives par défaut
UPDATE public.product_categories SET is_active = true WHERE is_active IS NULL;
UPDATE public.recipe_categories SET is_active = true WHERE is_active IS NULL;

-- Ajouter des index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_product_categories_active ON public.product_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_recipe_categories_active ON public.recipe_categories(is_active);

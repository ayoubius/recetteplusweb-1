
-- Ajout des contraintes de clés étrangères manquantes pour résoudre les erreurs de relation
-- Relation entre recipes et profiles (created_by)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'recipes_created_by_fkey') THEN
        ALTER TABLE public.recipes 
        ADD CONSTRAINT recipes_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Relation entre videos et profiles (created_by) 
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_created_by_fkey') THEN
        ALTER TABLE public.videos 
        ADD CONSTRAINT videos_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Relation entre videos et recipes (recipe_id)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_recipe_id_fkey') THEN
        ALTER TABLE public.videos 
        ADD CONSTRAINT videos_recipe_id_fkey 
        FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE SET NULL;
    END IF;
END $$;

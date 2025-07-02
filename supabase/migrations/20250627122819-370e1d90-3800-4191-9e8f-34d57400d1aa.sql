
-- Création du bucket de stockage pour les vidéos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('videos', 'videos', true);

-- Politique de stockage pour permettre l'upload et la lecture des vidéos
CREATE POLICY "Anyone can view videos" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Authenticated users can upload videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own videos" ON storage.objects FOR UPDATE USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own videos" ON storage.objects FOR DELETE USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Mise à jour de la table videos pour remplacer cloudinary_public_id par video_url
ALTER TABLE public.videos DROP COLUMN IF EXISTS cloudinary_public_id;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Mise à jour des politiques RLS existantes si nécessaire
DROP POLICY IF EXISTS "Anyone can view videos" ON public.videos;
DROP POLICY IF EXISTS "Users can create videos" ON public.videos;
DROP POLICY IF EXISTS "Users can update own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can delete own videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can manage all videos" ON public.videos;

CREATE POLICY "Anyone can view videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Users can create videos" ON public.videos FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own videos" ON public.videos FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own videos" ON public.videos FOR DELETE USING (auth.uid() = created_by);
CREATE POLICY "Admins can manage all videos" ON public.videos FOR ALL USING (public.is_admin());

-- Même chose pour les recettes
DROP POLICY IF EXISTS "Anyone can view recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can create recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can update own recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can delete own recipes" ON public.recipes;
DROP POLICY IF EXISTS "Admins can manage all recipes" ON public.recipes;

CREATE POLICY "Anyone can view recipes" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Users can create recipes" ON public.recipes FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own recipes" ON public.recipes FOR UPDATE USING (auth.uid() = created_by);  
CREATE POLICY "Users can delete own recipes" ON public.recipes FOR DELETE USING (auth.uid() = created_by);
CREATE POLICY "Admins can manage all recipes" ON public.recipes FOR ALL USING (public.is_admin());

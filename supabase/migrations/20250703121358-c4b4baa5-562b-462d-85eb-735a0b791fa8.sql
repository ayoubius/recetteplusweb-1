
-- Mise à jour des politiques de stockage pour permettre l'upload aux utilisateurs authentifiés

-- Politique pour le bucket 'produits'
DROP POLICY IF EXISTS "Authenticated users can upload products images" ON storage.objects;
CREATE POLICY "Authenticated users can upload products images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'produits' AND auth.role() = 'authenticated');

-- Politique pour le bucket 'recette'
DROP POLICY IF EXISTS "Authenticated users can upload recipe images" ON storage.objects;
CREATE POLICY "Authenticated users can upload recipe images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'recette' AND auth.role() = 'authenticated');

-- Politique pour le bucket 'videos'
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
CREATE POLICY "Authenticated users can upload videos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Politiques pour permettre la mise à jour et suppression (optionnel)
DROP POLICY IF EXISTS "Users can update their uploads" ON storage.objects;
CREATE POLICY "Users can update their uploads" 
ON storage.objects FOR UPDATE 
USING (bucket_id IN ('produits', 'recette', 'videos') AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete their uploads" ON storage.objects;
CREATE POLICY "Users can delete their uploads" 
ON storage.objects FOR DELETE 
USING (bucket_id IN ('produits', 'recette', 'videos') AND auth.role() = 'authenticated');

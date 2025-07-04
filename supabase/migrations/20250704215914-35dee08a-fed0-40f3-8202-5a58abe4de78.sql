
-- Supprimer les anciennes politiques du bucket avatars s'il y en a
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload avatar images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update avatar images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete avatar images" ON storage.objects;

-- Créer des politiques permissives pour le bucket avatars
CREATE POLICY "Anyone can view avatar images" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatar images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update avatar images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete avatar images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated'
  );


-- Créer un bucket pour les images des paniers préconfigurés
INSERT INTO storage.buckets (id, name, public)
VALUES ('paniers-preconfigures', 'paniers-preconfigures', true);

-- Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload preconfigured cart images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'paniers-preconfigures' AND auth.role() = 'authenticated');

-- Politique pour permettre la mise à jour
CREATE POLICY "Users can update preconfigured cart images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'paniers-preconfigures' AND auth.role() = 'authenticated');

-- Politique pour permettre la suppression
CREATE POLICY "Users can delete preconfigured cart images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'paniers-preconfigures' AND auth.role() = 'authenticated');

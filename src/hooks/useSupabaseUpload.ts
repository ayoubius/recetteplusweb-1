
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (
    file: File,
    bucket: string,
    path?: string
  ): Promise<string | null> => {
    if (!file) return null;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Simuler le progrès
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      console.log('Uploading file:', fileName, 'to bucket:', bucket);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        console.error('Upload error details:', error);
        throw error;
      }

      console.log('Upload successful:', data);

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      console.log('Public URL:', publicUrl);

      toast({
        title: "Upload réussi",
        description: "Le fichier a été uploadé avec succès",
      });

      return publicUrl;
    } catch (error) {
      console.error('Erreur upload:', error);
      toast({
        title: "Erreur d'upload",
        description: error instanceof Error ? error.message : "Impossible d'uploader le fichier",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadFile,
    uploading,
    uploadProgress
  };
};

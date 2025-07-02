
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Video as VideoIcon, CheckCircle } from 'lucide-react';
import { useSupabaseRecipes } from '@/hooks/useSupabaseRecipes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Video } from '@/hooks/useSupabaseVideos';

interface VideoFormProps {
  video?: Video;
  onSubmit: (data: Omit<Video, 'id' | 'created_at'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const VideoForm: React.FC<VideoFormProps> = ({ video, onSubmit, onCancel, isLoading }) => {
  const { data: recipes } = useSupabaseRecipes();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    video_url: video?.video_url || '',
    thumbnail: video?.thumbnail || '',
    duration: video?.duration || '',
    views: video?.views || 0,
    likes: video?.likes || 0,
    category: video?.category || '',
    recipe_id: video?.recipe_id || ''
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La vidéo ne doit pas dépasser 100MB",
          variant: "destructive"
        });
        return;
      }

      setVideoFile(file);
      // Créer une URL de prévisualisation
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setUploadComplete(false);
    }
  };

  const uploadVideoToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    // Simuler le progrès de l'upload
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(data.path);

      setUploadComplete(true);
      return publicUrl;
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let videoUrl = formData.video_url;
    
    // Si un nouveau fichier est sélectionné, l'uploader
    if (videoFile) {
      setUploading(true);
      try {
        videoUrl = await uploadVideoToSupabase(videoFile);
        
        toast({
          title: "Vidéo uploadée",
          description: "La vidéo a été uploadée avec succès"
        });
      } catch (error) {
        toast({
          title: "Erreur d'upload",
          description: "Impossible d'uploader la vidéo",
          variant: "destructive"
        });
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const cleanData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      video_url: videoUrl || null,
      thumbnail: formData.thumbnail.trim() || null,
      duration: formData.duration.trim() || null,
      views: Math.max(0, formData.views || 0),
      likes: Math.max(0, formData.likes || 0),
      category: formData.category.trim(),
      recipe_id: formData.recipe_id || null
    };

    console.log('Submitting video data:', cleanData);
    onSubmit(cleanData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <VideoIcon className="h-5 w-5 mr-2" />
          {video ? 'Modifier la vidéo' : 'Ajouter une vidéo'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Catégorie *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="ex: Techniques de base"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="recipe_id">Recette associée (optionnel)</Label>
            <Select value={formData.recipe_id} onValueChange={(value) => setFormData({...formData, recipe_id: value === 'none' ? '' : value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une recette" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune recette</SelectItem>
                {recipes?.map((recipe) => (
                  <SelectItem key={recipe.id} value={recipe.id}>
                    {recipe.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="video">Fichier vidéo</Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadComplete ? (
                      <CheckCircle className="w-8 h-8 mb-4 text-green-500" />
                    ) : (
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    )}
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Cliquer pour uploader</span> ou glisser-déposer
                    </p>
                    <p className="text-xs text-gray-500">MP4, AVI, MOV (MAX. 100MB)</p>
                  </div>
                  <input
                    id="video"
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
              </div>
              
              {videoFile && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-600">
                      Fichier sélectionné: {videoFile.name}
                    </p>
                    {uploadComplete && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  
                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Upload en cours...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {videoPreview && (
            <div>
              <Label>Prévisualisation</Label>
              <video
                src={videoPreview}
                controls
                className="w-full max-w-md h-48 rounded-lg border mt-2"
              />
            </div>
          )}

          <div>
            <Label htmlFor="thumbnail">URL de la miniature (optionnel)</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="duration">Durée</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="ex: 10:30"
              />
            </div>
            <div>
              <Label htmlFor="views">Vues</Label>
              <Input
                id="views"
                type="number"
                value={formData.views}
                onChange={(e) => setFormData({...formData, views: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="likes">Likes</Label>
              <Input
                id="likes"
                type="number"
                value={formData.likes}
                onChange={(e) => setFormData({...formData, likes: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={uploading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || uploading}>
              {uploading ? 'Upload en cours...' : isLoading ? 'Enregistrement...' : (video ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoForm;

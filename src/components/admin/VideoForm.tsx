
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video as VideoIcon } from 'lucide-react';
import { useSupabaseRecipes } from '@/hooks/useSupabaseRecipes';
import { Video } from '@/hooks/useSupabaseVideos';
import FileUploadField from './FileUploadField';
import { useSupabaseUpload } from '@/hooks/useSupabaseUpload';

interface VideoFormProps {
  video?: Video;
  onSubmit: (data: Omit<Video, 'id' | 'created_at'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const VideoForm: React.FC<VideoFormProps> = ({ video, onSubmit, onCancel, isLoading }) => {
  const { data: recipes } = useSupabaseRecipes();
  const { uploadFile, uploading, uploadProgress } = useSupabaseUpload();
  
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let videoUrl = formData.video_url;
    let thumbnailUrl = formData.thumbnail;
    
    // Upload video if selected
    if (selectedVideoFile) {
      const uploadedVideoUrl = await uploadFile(selectedVideoFile, 'videos');
      if (uploadedVideoUrl) {
        videoUrl = uploadedVideoUrl;
      }
    }
    
    // Upload thumbnail if selected
    if (selectedThumbnailFile) {
      const uploadedThumbnailUrl = await uploadFile(selectedThumbnailFile, 'recette');
      if (uploadedThumbnailUrl) {
        thumbnailUrl = uploadedThumbnailUrl;
      }
    }

    const cleanData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      video_url: videoUrl || null,
      thumbnail: thumbnailUrl || null,
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

          <FileUploadField
            label="Fichier vidéo"
            value={formData.video_url}
            onChange={(url) => setFormData({...formData, video_url: url})}
            onFileSelect={setSelectedVideoFile}
            acceptedTypes="video/*"
            uploading={uploading}
            uploadProgress={uploadProgress}
            placeholder="https://exemple.com/video.mp4"
            showPreview={false}
          />

          <FileUploadField
            label="Miniature"
            value={formData.thumbnail}
            onChange={(url) => setFormData({...formData, thumbnail: url})}
            onFileSelect={setSelectedThumbnailFile}
            acceptedTypes="image/*"
            uploading={uploading}
            uploadProgress={uploadProgress}
            placeholder="https://exemple.com/miniature.jpg"
          />

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

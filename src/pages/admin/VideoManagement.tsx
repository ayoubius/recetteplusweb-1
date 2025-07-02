
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Video } from 'lucide-react';
import VideoForm from '@/components/admin/VideoForm';
import VideoTable from '@/components/admin/video/VideoTable';
import VideoHeader from '@/components/admin/video/VideoHeader';
import { useSupabaseVideos, useCreateSupabaseVideo, useUpdateSupabaseVideo, useDeleteSupabaseVideo, Video as VideoType } from '@/hooks/useSupabaseVideos';
import { useCurrentUserPermissions } from '@/hooks/useAdminPermissions';

const VideoManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  
  const { data: videos = [], isLoading: videosLoading, refetch } = useSupabaseVideos();
  const { data: permissions } = useCurrentUserPermissions();
  
  const createVideoMutation = useCreateSupabaseVideo();
  const updateVideoMutation = useUpdateSupabaseVideo();
  const deleteVideoMutation = useDeleteSupabaseVideo();

  // Vérifier les permissions - avec les 3 droits d'accès possibles
  const canViewVideos = permissions?.can_manage_videos || permissions?.can_manage_recipes || permissions?.can_manage_products || permissions?.is_super_admin;
  const canManageVideos = permissions?.can_manage_videos || permissions?.is_super_admin;

  const filteredVideos = videos?.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreate = async (data: Omit<VideoType, 'id' | 'created_at' | 'views' | 'likes'>) => {
    if (!canManageVideos) return;
    
    try {
      await createVideoMutation.mutateAsync(data);
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Error creating video:', error);
    }
  };

  const handleUpdate = async (data: Omit<VideoType, 'id' | 'created_at'>) => {
    if (!editingVideo || !canManageVideos) return;
    
    try {
      await updateVideoMutation.mutateAsync({
        id: editingVideo.id,
        ...data
      });
      setEditingVideo(null);
      refetch();
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!canManageVideos) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la vidéo "${title}" ?`)) {
      try {
        await deleteVideoMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const isLoading = videosLoading;
  const isMutating = createVideoMutation.isPending || updateVideoMutation.isPending || deleteVideoMutation.isPending;

  if (!canViewVideos) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Video className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            Accès refusé
          </h3>
          <p className="text-gray-500">
            Vous n'avez pas les permissions nécessaires pour accéder à cette section.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VideoHeader 
        onAddVideo={canManageVideos ? () => setShowForm(true) : undefined}
        videoCount={videos.length}
      />

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une vidéo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Videos Table */}
      <VideoTable
        videos={filteredVideos}
        onEdit={canManageVideos ? setEditingVideo : undefined}
        onDelete={canManageVideos ? handleDelete : undefined}
        isLoading={isMutating}
      />

      {/* Create Form Dialog */}
      {canManageVideos && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter une vidéo</DialogTitle>
            </DialogHeader>
            <VideoForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              isLoading={createVideoMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Form Dialog */}
      {canManageVideos && (
        <Dialog open={!!editingVideo} onOpenChange={() => setEditingVideo(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier la vidéo</DialogTitle>
            </DialogHeader>
            {editingVideo && (
              <VideoForm
                video={editingVideo}
                onSubmit={handleUpdate}
                onCancel={() => setEditingVideo(null)}
                isLoading={updateVideoMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default VideoManagement;

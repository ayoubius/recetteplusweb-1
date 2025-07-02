
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth } from '@/lib/firebase';

// Configuration Firebase Storage
const storage = getStorage();

// Fonction pour créer les buckets nécessaires (référence seulement)
export const createVideoBuckets = () => {
  console.log('Firebase Storage buckets will be created automatically when first file is uploaded');
  // Les buckets Firebase Storage sont créés automatiquement lors du premier upload
  // Buckets recommandés pour Recette+ :
  // - videos/ (pour les fichiers vidéo)
  // - thumbnails/ (pour les miniatures)
  // - temp/ (pour les uploads temporaires)
};

// Upload d'une vidéo
export const uploadVideo = async (file: File, videoId: string): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error('Utilisateur non authentifié');
  }

  const timestamp = Date.now();
  const fileName = `${videoId}_${timestamp}.${file.name.split('.').pop()}`;
  const videoRef = ref(storage, `videos/${fileName}`);
  
  try {
    const snapshot = await uploadBytes(videoRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Vidéo uploadée avec succès:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors de l\'upload de la vidéo:', error);
    throw error;
  }
};

// Upload d'une miniature
export const uploadThumbnail = async (file: File, videoId: string): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error('Utilisateur non authentifié');
  }

  const timestamp = Date.now();
  const fileName = `thumb_${videoId}_${timestamp}.${file.name.split('.').pop()}`;
  const thumbnailRef = ref(storage, `thumbnails/${fileName}`);
  
  try {
    const snapshot = await uploadBytes(thumbnailRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Miniature uploadée avec succès:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors de l\'upload de la miniature:', error);
    throw error;
  }
};

// Suppression d'une vidéo
export const deleteVideo = async (videoUrl: string): Promise<void> => {
  try {
    const videoRef = ref(storage, videoUrl);
    await deleteObject(videoRef);
    console.log('Vidéo supprimée avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo:', error);
    throw error;
  }
};

// Suppression d'une miniature
export const deleteThumbnail = async (thumbnailUrl: string): Promise<void> => {
  try {
    const thumbnailRef = ref(storage, thumbnailUrl);
    await deleteObject(thumbnailRef);
    console.log('Miniature supprimée avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression de la miniature:', error);
    throw error;
  }
};

export { storage };

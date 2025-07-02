
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Video } from '@/lib/firestore';

export interface VideoData extends Omit<Video, 'id' | 'createdAt'> {
  createdBy: string;
}

export interface VideoFilters {
  category?: string;
  createdBy?: string;
  searchTerm?: string;
}

class VideoService {
  private collectionName = 'videos';

  async create(data: VideoData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Video created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating video:', error);
      throw error;
    }
  }

  async getAll(): Promise<Video[]> {
    try {
      const q = query(collection(db, this.collectionName), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Video | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Video;
      }
      return null;
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  }

  async getFiltered(filters: VideoFilters): Promise<Video[]> {
    try {
      let q = query(collection(db, this.collectionName), orderBy('createdAt', 'desc'));

      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      
      if (filters.createdBy) {
        q = query(q, where('createdBy', '==', filters.createdBy));
      }

      const snapshot = await getDocs(q);
      let videos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];

      // Filtrage côté client pour la recherche textuelle
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        videos = videos.filter(video => 
          video.title.toLowerCase().includes(searchLower) ||
          video.description.toLowerCase().includes(searchLower) ||
          video.category.toLowerCase().includes(searchLower)
        );
      }

      return videos;
    } catch (error) {
      console.error('Error fetching filtered videos:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<VideoData>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      console.log('Video updated:', id);
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      console.log('Video deleted:', id);
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }

  async getByUser(userId: string): Promise<Video[]> {
    try {
      const q = query(
        collection(db, this.collectionName), 
        where('createdBy', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];
    } catch (error) {
      console.error('Error fetching user videos:', error);
      throw error;
    }
  }

  getCategories(videos: Video[]): string[] {
    const categories = new Set(videos.map(video => video.category));
    return Array.from(categories).sort();
  }
}

export const videoService = new VideoService();

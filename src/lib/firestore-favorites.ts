
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface Favorite {
  id: string;
  userId: string;
  itemId: string;
  type: 'recipe' | 'product' | 'video';
  createdAt: any;
}

export const favoriteService = {
  async getUserFavorites(userId: string) {
    const q = query(
      collection(db, 'favorites'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Favorite[];
  },

  async addFavorite(userId: string, itemId: string, type: string) {
    // Vérifier si le favori existe déjà
    const existingQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('itemId', '==', itemId),
      where('type', '==', type)
    );
    const existingSnapshot = await getDocs(existingQuery);
    
    if (existingSnapshot.empty) {
      await addDoc(collection(db, 'favorites'), {
        userId,
        itemId,
        type,
        createdAt: serverTimestamp()
      });
    }
  },

  async removeFavorite(userId: string, itemId: string, type: string) {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('itemId', '==', itemId),
      where('type', '==', type)
    );
    const snapshot = await getDocs(q);
    
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(docSnapshot.ref);
    }
  }
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { updateProfile, deleteUser as deleteFirebaseUser } from 'firebase/auth';
import { doc, updateDoc, deleteDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FirebaseAuthUser {
  uid: string;
  email?: string;
  displayName?: string;
  disabled: boolean;
  emailVerified: boolean;
  creationTime?: string;
  lastSignInTime?: string;
  photoURL?: string;
  role?: 'user' | 'admin';
}

// Service pour gérer les utilisateurs via Firestore (pour les données étendues)
const firebaseAuthUserService = {
  async getAllUsers(): Promise<FirebaseAuthUser[]> {
    try {
      // Récupérer les utilisateurs depuis Firestore collection 'users'
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const users: FirebaseAuthUser[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        users.push({
          uid: doc.id,
          email: userData.email,
          displayName: userData.displayName,
          disabled: false, // Par défaut depuis Firestore
          emailVerified: userData.emailVerified || false,
          creationTime: userData.createdAt?.toDate?.()?.toISOString() || userData.createdAt,
          lastSignInTime: userData.lastSignInTime?.toDate?.()?.toISOString() || userData.lastSignInTime,
          photoURL: userData.photoURL,
          role: userData.role || 'user'
        });
      });
      
      console.log('Fetched users from Firestore:', users.length);
      return users;
    } catch (error) {
      console.error('Error fetching users from Firestore:', error);
      throw error;
    }
  },

  async updateUser(uid: string, properties: {
    displayName?: string;
    disabled?: boolean;
    emailVerified?: boolean;
    role?: 'user' | 'admin';
  }): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      const updateData: any = {};
      
      if (properties.displayName !== undefined) updateData.displayName = properties.displayName;
      if (properties.role !== undefined) updateData.role = properties.role;
      
      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(uid: string): Promise<void> {
    try {
      // Supprimer de Firestore
      const userRef = doc(db, 'users', uid);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

export const useFirebaseAuthUsers = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['firebase-auth-users'],
    queryFn: firebaseAuthUserService.getAllUsers,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    meta: {
      onError: () => {
        toast({
          title: "Erreur de connexion",
          description: "Impossible de récupérer les utilisateurs.",
          variant: "destructive"
        });
      }
    }
  });
};

export const useUpdateFirebaseAuthUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ uid, properties }: { 
      uid: string; 
      properties: {
        displayName?: string;
        disabled?: boolean;
        emailVerified?: boolean;
        role?: 'user' | 'admin';
      }
    }) => {
      return firebaseAuthUserService.updateUser(uid, properties);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firebase-auth-users'] });
      toast({
        title: "Utilisateur modifié",
        description: "Les informations de l'utilisateur ont été mises à jour avec succès."
      });
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'utilisateur.",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteFirebaseAuthUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (uid: string) => {
      return firebaseAuthUserService.deleteUser(uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firebase-auth-users'] });
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
        variant: "destructive"
      });
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
        variant: "destructive"
      });
    }
  });
};

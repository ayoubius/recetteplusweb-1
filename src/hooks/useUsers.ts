import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';

export const useUsers = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const users = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as UserProfile[];
        
        console.log('Fetched users:', users.length);
        return users;
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de récupérer les utilisateurs. Vérifiez votre connexion.",
          variant: "destructive"
        });
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<UserProfile> }) => {
      const docRef = doc(db, 'users', userId);
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );
      await updateDoc(docRef, {
        ...cleanData,
        updatedAt: new Date()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      const docRef = doc(db, 'users', userId);
      await deleteDoc(docRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Hook désactivé - utiliser useFirebaseAuthUsers à la place
export const useAdminUsers = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['admin-users-disabled'],
    queryFn: () => {
      console.warn('useAdminUsers is disabled. Use useFirebaseAuthUsers instead.');
      return Promise.resolve([]);
    },
    enabled: false, // Désactivé
    staleTime: Infinity,
  });
};

export const useAdminUser = (uid: string) => {
  return useQuery({
    queryKey: ['admin-user-disabled', uid],
    queryFn: () => {
      console.warn('useAdminUser is disabled. Use useFirebaseAuthUsers instead.');
      return Promise.resolve(null);
    },
    enabled: false,
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => {
      console.warn('useUpdateAdminUser is disabled. Use useUpdateFirebaseAuthUser instead.');
      return Promise.resolve();
    },
    onSuccess: () => {
      toast({
        title: "Service désactivé",
        description: "Utilisez le nouveau service Firebase Auth.",
        variant: "destructive"
      });
    },
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => {
      console.warn('useDeleteAdminUser is disabled. Use useDeleteFirebaseAuthUser instead.');
      return Promise.resolve();
    },
    onSuccess: () => {
      toast({
        title: "Service désactivé",
        description: "Utilisez le nouveau service Firebase Auth.",
        variant: "destructive"
      });
    },
  });
};

export const useSetUserClaims = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => {
      console.warn('useSetUserClaims is disabled.');
      return Promise.resolve();
    },
    onSuccess: () => {
      toast({
        title: "Service désactivé",
        description: "Cette fonctionnalité n'est plus disponible.",
        variant: "destructive"
      });
    },
  });
};

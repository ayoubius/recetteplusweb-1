import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            full_name: displayName
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte"
      });
    } catch (error: any) {
      console.error('Error during sign up:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error during Google login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Vérifier d'abord si nous avons une session active
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        console.log('No active session found, clearing local state');
        setCurrentUser(null);
        setSession(null);
        return;
      }

      const { error } = await supabase.auth.signOut();
      
      // Même si il y a une erreur, on nettoie l'état local
      setCurrentUser(null);
      setSession(null);
      
      if (error) {
        console.warn('Logout warning:', error);
        // Ne pas lancer l'erreur si c'est juste une session manquante
        if (error.message !== 'Auth session missing!') {
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Error during logout:', error);
      // Nettoyer l'état local même en cas d'erreur
      setCurrentUser(null);
      setSession(null);
      
      // Ne pas lancer l'erreur pour les problèmes de session manquante
      if (error.message !== 'Auth session missing!') {
        throw error;
      }
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error during password reset:', error);
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    if (currentUser) {
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: currentUser.email!
        });

        if (error) throw error;
      } catch (error: any) {
        console.error('Error sending verification email:', error);
        throw error;
      }
    }
  };

  const updateUserProfile = async (displayName: string) => {
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { display_name: displayName, full_name: displayName }
      });

      if (authError) throw authError;

      if (currentUser) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ display_name: displayName })
          .eq('id', currentUser.id);

        if (profileError) throw profileError;
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setCurrentUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,
    session,
    loading,
    signUp,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    sendVerificationEmail,
    updateUserProfile,
    updateUserPassword,
    isConfigured: true
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

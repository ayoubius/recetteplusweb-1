
// Note: Ce fichier ne devrait être utilisé que côté serveur/admin
// Pour éviter les erreurs côté client, nous ajoutons des vérifications

let admin: any = null;
let adminAuth: any = null;
let adminFirestore: any = null;

// Vérification de l'environnement pour éviter les erreurs côté client
const isServer = typeof window === 'undefined';
const isNode = typeof process !== 'undefined' && process.versions?.node;

if (isServer || isNode) {
  try {
    admin = require('firebase-admin/app');
    adminAuth = require('firebase-admin/auth');
    adminFirestore = require('firebase-admin/firestore');
  } catch (error) {
    console.warn('Firebase Admin SDK not available in this environment');
  }
}

export interface AdminUser {
  uid: string;
  email?: string;
  displayName?: string;
  disabled: boolean;
  emailVerified: boolean;
  creationTime?: string;
  lastSignInTime?: string;
  customClaims?: { [key: string]: any };
}

// Initialisation sécurisée
let adminApp: any = null;

const initializeAdminApp = () => {
  if (!admin || adminApp) return adminApp;
  
  try {
    // Vérification si une app existe déjà
    try {
      adminApp = admin.getApp();
    } catch (error) {
      // Si aucune app n'existe, on en crée une
      adminApp = admin.initializeApp({
        credential: admin.cert('./firebaseAdmin.json')
      });
    }
    return adminApp;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de Firebase Admin:', error);
    return null;
  }
};

export const adminUserService = {
  async getAllUsers(maxResults: number = 1000): Promise<AdminUser[]> {
    if (!adminAuth || !initializeAdminApp()) {
      throw new Error('Firebase Admin SDK non disponible');
    }
    
    try {
      const auth = adminAuth.getAuth(adminApp);
      const listUsersResult = await auth.listUsers(maxResults);
      
      return listUsersResult.users.map((userRecord: any) => ({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        disabled: userRecord.disabled,
        emailVerified: userRecord.emailVerified,
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
        customClaims: userRecord.customClaims || {}
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  async getUserById(uid: string): Promise<AdminUser> {
    if (!adminAuth || !initializeAdminApp()) {
      throw new Error('Firebase Admin SDK non disponible');
    }
    
    try {
      const auth = adminAuth.getAuth(adminApp);
      const userRecord = await auth.getUser(uid);
      
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        disabled: userRecord.disabled,
        emailVerified: userRecord.emailVerified,
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
        customClaims: userRecord.customClaims || {}
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  },

  async updateUser(uid: string, properties: {
    email?: string;
    displayName?: string;
    disabled?: boolean;
    emailVerified?: boolean;
  }): Promise<void> {
    if (!adminAuth || !initializeAdminApp()) {
      throw new Error('Firebase Admin SDK non disponible');
    }
    
    try {
      const auth = adminAuth.getAuth(adminApp);
      await auth.updateUser(uid, properties);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  },

  async deleteUser(uid: string): Promise<void> {
    if (!adminAuth || !initializeAdminApp()) {
      throw new Error('Firebase Admin SDK non disponible');
    }
    
    try {
      const auth = adminAuth.getAuth(adminApp);
      await auth.deleteUser(uid);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  },

  async setCustomClaims(uid: string, claims: { [key: string]: any }): Promise<void> {
    if (!adminAuth || !initializeAdminApp()) {
      throw new Error('Firebase Admin SDK non disponible');
    }
    
    try {
      const auth = adminAuth.getAuth(adminApp);
      await auth.setCustomUserClaims(uid, claims);
    } catch (error) {
      console.error('Erreur lors de la définition des claims:', error);
      throw error;
    }
  }
};

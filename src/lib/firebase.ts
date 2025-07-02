
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Check if Firebase environment variables are configured
const hasFirebaseConfig = true;

const firebaseConfig = {
  apiKey: "AIzaSyDyTa4_ltMe9y7nS0OHFK5Ata8C7ZuV8Bc",
  authDomain: "recette-plus-app.firebaseapp.com",
  projectId: "recette-plus-app",
  storageBucket: "recette-plus-app.firebasestorage.app",
  messagingSenderId: "361640124056",
  appId: "1:361640124056:web:5e7800c593d5ef089c7aed",
  measurementId: "G-GZPWYFVQ9L"
};
// Log warning if Firebase is not properly configured
if (!hasFirebaseConfig) {
  console.warn('⚠️ Firebase n\'est pas configuré. Veuillez ajouter vos clés Firebase dans les variables d\'environnement.');
  console.info('📋 Variables requises:');
  console.info('- VITE_FIREBASE_API_KEY');
  console.info('- VITE_FIREBASE_AUTH_DOMAIN');
  console.info('- VITE_FIREBASE_PROJECT_ID');
  console.info('- VITE_FIREBASE_STORAGE_BUCKET');
  console.info('- VITE_FIREBASE_MESSAGING_SENDER_ID');
  console.info('- VITE_FIREBASE_APP_ID');
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Export configuration status for components to check
export const isFirebaseConfigured = hasFirebaseConfig;

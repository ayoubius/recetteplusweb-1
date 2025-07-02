import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { PRODUCT_CATEGORIES, RECIPE_CATEGORIES, ProductCategory, RecipeCategory } from './categories';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: number;
  servings: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  rating: number;
  category: RecipeCategory;
  ingredients: Array<{
    productId: string; // Référence obligatoire vers un produit existant
    quantity: string;
    unit: string;
  }>;
  instructions: string[];
  videoId?: string; // Lien optionnel vers une vidéo
  createdAt: any;
  createdBy: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  category: ProductCategory;
  rating: number;
  inStock: boolean;
  promotion?: {
    discount: number;
    originalPrice: number;
  };
  createdAt: any;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  cloudinaryPublicId: string; // ID Cloudinary au lieu de l'URL directe
  thumbnail?: string;
  duration: string;
  views: number;
  likes: number;
  category: string;
  recipeId?: string; // Lien vers une recette
  createdAt: any;
  createdBy: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: any;
}

export interface UserProfile {
  id?: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'admin';
  preferences: {
    dietaryRestrictions: string[];
    favoriteCategories: string[];
  };
  createdAt?: any;
  updatedAt?: any;
}

// Services pour les recettes avec gestion des catégories
export const recipeService = {
  async getAll() {
    const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recipe[];
  },

  async getByCategory(category: RecipeCategory) {
    const q = query(
      collection(db, 'recipes'), 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recipe[];
  },

  async getById(id: string) {
    const docRef = doc(db, 'recipes', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Recipe : null;
  },

  async create(recipe: Omit<Recipe, 'id' | 'createdAt'>) {
    // Valider la catégorie
    if (!RECIPE_CATEGORIES.includes(recipe.category)) {
      throw new Error(`Catégorie de recette invalide: ${recipe.category}`);
    }
    
    const docRef = await addDoc(collection(db, 'recipes'), {
      ...recipe,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(id: string, data: Partial<Recipe>) {
    // Valider la catégorie si elle est fournie
    if (data.category && !RECIPE_CATEGORIES.includes(data.category)) {
      throw new Error(`Catégorie de recette invalide: ${data.category}`);
    }
    
    const docRef = doc(db, 'recipes', id);
    await updateDoc(docRef, data);
  },

  async delete(id: string) {
    const docRef = doc(db, 'recipes', id);
    await deleteDoc(docRef);
  }
};

// Services pour les produits avec gestion des catégories
export const productService = {
  async getAll() {
    const q = query(collection(db, 'products'), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
  },

  async getByCategory(category: ProductCategory) {
    const q = query(
      collection(db, 'products'), 
      where('category', '==', category),
      orderBy('name')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
  },

  async getById(id: string) {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Product : null;
  },

  async create(product: Omit<Product, 'id' | 'createdAt'>) {
    // Valider la catégorie
    if (!PRODUCT_CATEGORIES.includes(product.category)) {
      throw new Error(`Catégorie de produit invalide: ${product.category}`);
    }
    
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(id: string, data: Partial<Product>) {
    // Valider la catégorie si elle est fournie
    if (data.category && !PRODUCT_CATEGORIES.includes(data.category)) {
      throw new Error(`Catégorie de produit invalide: ${data.category}`);
    }
    
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, data);
  },

  async delete(id: string) {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  }
};

// Services pour les vidéos
export const videoService = {
  async getAll() {
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Video[];
  },

  async getById(id: string) {
    const docRef = doc(db, 'videos', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Video : null;
  },

  async getByRecipeId(recipeId: string) {
    const q = query(
      collection(db, 'videos'), 
      where('recipeId', '==', recipeId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Video[];
  },

  async create(video: Omit<Video, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'videos'), {
      ...video,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(id: string, data: Partial<Video>) {
    const docRef = doc(db, 'videos', id);
    await updateDoc(docRef, data);
  },

  async delete(id: string) {
    const docRef = doc(db, 'videos', id);
    await deleteDoc(docRef);
  }
};

// Services pour le panier
export const cartService = {
  async getCartItems(userId: string) {
    const q = query(
      collection(db, 'cartItems'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CartItem[];
  },

  async addToCart(userId: string, productId: string, quantity: number) {
    await addDoc(collection(db, 'cartItems'), {
      userId,
      productId,
      quantity,
      createdAt: serverTimestamp()
    });
  },

  async updateQuantity(cartItemId: string, quantity: number) {
    const docRef = doc(db, 'cartItems', cartItemId);
    await updateDoc(docRef, { quantity });
  },

  async removeFromCart(cartItemId: string) {
    const docRef = doc(db, 'cartItems', cartItemId);
    await deleteDoc(docRef);
  }
};

// Services pour le profil utilisateur
export const userService = {
  async getProfile(userId: string) {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as UserProfile : null;
  },

  async createProfile(userId: string, profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  async updateProfile(userId: string, data: Partial<UserProfile>) {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }
};

// Utilitaires pour formater les prix en FCFA
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatPriceCompact = (price: number): string => {
  if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}k FCFA`;
  }
  return `${price} FCFA`;
};

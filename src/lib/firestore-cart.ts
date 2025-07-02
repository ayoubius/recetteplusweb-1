
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
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { CartItem, RecipeCart, PreconfiguredCart, CartType } from './cart-types';

// Services pour les paniers personnalisés
export const customCartService = {
  async getCartItems(userId: string) {
    const q = query(
      collection(db, 'cartItems'), 
      where('userId', '==', userId),
      where('cartType', '==', 'custom'),
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
      cartType: 'custom' as CartType,
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

// Services pour les paniers recette
export const recipeCartService = {
  async addRecipeToCart(userId: string, recipeId: string, recipeName: string, ingredients: Array<{productId: string, quantity: number}>) {
    // Créer les items du panier pour chaque ingrédient
    const cartItems = [];
    for (const ingredient of ingredients) {
      const docRef = await addDoc(collection(db, 'cartItems'), {
        userId,
        productId: ingredient.productId,
        quantity: ingredient.quantity,
        cartType: 'recipe' as CartType,
        recipeId,
        createdAt: serverTimestamp()
      });
      cartItems.push(docRef.id);
    }

    // Créer l'entrée du panier recette
    await addDoc(collection(db, 'recipeCarts'), {
      userId,
      recipeId,
      recipeName,
      cartItems,
      createdAt: serverTimestamp()
    });
  },

  async getRecipeCarts(userId: string) {
    const q = query(
      collection(db, 'recipeCarts'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RecipeCart[];
  },

  async removeRecipeFromCart(recipeCartId: string) {
    // Supprimer tous les items associés à ce panier recette
    const recipeCartDoc = await getDoc(doc(db, 'recipeCarts', recipeCartId));
    if (recipeCartDoc.exists()) {
      const data = recipeCartDoc.data();
      const recipeId = data.recipeId;
      const userId = data.userId;

      // Supprimer tous les cartItems de cette recette
      const q = query(
        collection(db, 'cartItems'),
        where('userId', '==', userId),
        where('recipeId', '==', recipeId),
        where('cartType', '==', 'recipe')
      );
      const cartItemsSnapshot = await getDocs(q);
      
      for (const doc of cartItemsSnapshot.docs) {
        await deleteDoc(doc.ref);
      }
    }

    // Supprimer l'entrée du panier recette
    await deleteDoc(doc(db, 'recipeCarts', recipeCartId));
  }
};

// Services pour les paniers préconfigurés
export const preconfiguredCartService = {
  async getAll() {
    const q = query(
      collection(db, 'preconfiguredCarts'), 
      where('isActive', '==', true),
      orderBy('name')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PreconfiguredCart[];
  },

  async getById(id: string) {
    const docRef = doc(db, 'preconfiguredCarts', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as PreconfiguredCart : null;
  },

  async addToUserCart(userId: string, preconfiguredCartId: string) {
    const preconfiguredCart = await this.getById(preconfiguredCartId);
    if (!preconfiguredCart) return;

    // Ajouter chaque item du panier préconfiguré au panier de l'utilisateur
    for (const item of preconfiguredCart.items) {
      await addDoc(collection(db, 'cartItems'), {
        userId,
        productId: item.productId,
        quantity: item.quantity,
        cartType: 'preconfigured' as CartType,
        preconfiguredCartId,
        createdAt: serverTimestamp()
      });
    }
  },

  async create(cart: Omit<PreconfiguredCart, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'preconfiguredCarts'), {
      ...cart,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(id: string, data: Partial<PreconfiguredCart>) {
    const docRef = doc(db, 'preconfiguredCarts', id);
    await updateDoc(docRef, data);
  },

  async delete(id: string) {
    const docRef = doc(db, 'preconfiguredCarts', id);
    await deleteDoc(docRef);
  }
};

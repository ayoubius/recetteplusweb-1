
export type CartType = 'recipe' | 'custom' | 'preconfigured';

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  cartType: CartType;
  recipeId?: string; // Pour les paniers recette
  preconfiguredCartId?: string; // Pour les paniers préconfigurés
  createdAt: any;
}

export interface RecipeCart {
  id: string;
  userId: string;
  recipeId: string;
  recipeName: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: any;
}

export interface PreconfiguredCart {
  id: string;
  name: string;
  description: string;
  image: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  totalPrice: number;
  category: string;
  isActive: boolean;
  createdAt: any;
}

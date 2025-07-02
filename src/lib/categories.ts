
// Catégories prédéfinies disponibles au Mali
export const PRODUCT_CATEGORIES = [
  'Légumes',
  'Fruits', 
  'Viandes',
  'Poissons',
  'Céréales',
  'Légumineuses',
  'Épices',
  'Herbes',
  'Huiles',
  'Condiments',
  'Produits laitiers',
  'Conserves'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

export const RECIPE_CATEGORIES = [
  'Plats traditionnels maliens',
  'Soupes et potages',
  'Riz et céréales',
  'Viandes grillées',
  'Poissons',
  'Légumes sautés',
  'Sauces',
  'Desserts',
  'Boissons',
  'Petit-déjeuner'
] as const;

export type RecipeCategory = typeof RECIPE_CATEGORIES[number];

// Validation des catégories
export const isValidProductCategory = (category: string): category is ProductCategory => {
  return PRODUCT_CATEGORIES.includes(category as ProductCategory);
};

export const isValidRecipeCategory = (category: string): category is RecipeCategory => {
  return RECIPE_CATEGORIES.includes(category as RecipeCategory);
};

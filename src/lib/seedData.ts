
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Recipe, Product, Video } from './firestore';

// Données exemple pour les recettes maliennes
const sampleRecipes: Omit<Recipe, 'id' | 'createdAt'>[] = [
  {
    title: 'Riz au Gras Traditionnel',
    description: 'Plat traditionnel malien avec du riz cuit dans une sauce riche en légumes',
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400',
    cookTime: 60,
    servings: 6,
    difficulty: 'Moyen',
    rating: 4.8,
    category: 'Plats traditionnels maliens',
    ingredients: [
      { productId: 'riz-blanc-500g', quantity: '500', unit: 'g' },
      { productId: 'viande-boeuf-300g', quantity: '300', unit: 'g' },
      { productId: 'tomates-3pc', quantity: '3', unit: 'pièces' },
      { productId: 'oignon-2pc', quantity: '2', unit: 'pièces' },
      { productId: 'huile-arachide-4cs', quantity: '4', unit: 'cuillères à soupe' }
    ],
    instructions: [
      'Faire revenir la viande dans l\'huile chaude',
      'Ajouter les oignons et tomates coupés',
      'Incorporer le riz et mélanger',
      'Ajouter de l\'eau et laisser cuire 45 minutes'
    ],
    createdBy: 'system'
  },
  {
    title: 'Dégué aux Fruits',
    description: 'Dessert traditionnel malien à base de mil et de fruits frais',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    cookTime: 20,
    servings: 4,
    difficulty: 'Facile',
    rating: 4.6,
    category: 'Desserts',
    ingredients: [
      { productId: 'mil-200g', quantity: '200', unit: 'g' },
      { productId: 'lait-500ml', quantity: '500', unit: 'ml' },
      { productId: 'sucre-100g', quantity: '100', unit: 'g' },
      { productId: 'mangue-2pc', quantity: '2', unit: 'pièces' },
      { productId: 'banane-2pc', quantity: '2', unit: 'pièces' }
    ],
    instructions: [
      'Cuire le mil dans le lait avec le sucre',
      'Laisser refroidir',
      'Couper les fruits en petits dés',
      'Mélanger et servir frais'
    ],
    createdBy: 'system'
  }
];

// Données exemple pour les produits maliens
const sampleProducts: Omit<Product, 'id' | 'createdAt'>[] = [
  {
    name: 'Tomates Fraîches',
    image: 'https://images.unsplash.com/photo-1546470427-e035b8397fb4?w=300',
    price: 750, // Prix en FCFA
    unit: 'kg',
    category: 'Légumes',
    rating: 4.6,
    inStock: true
  },
  {
    name: 'Lait Frais Local',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
    price: 1200,
    unit: 'litre',
    category: 'Produits laitiers',
    rating: 4.8,
    inStock: true,
    promotion: { discount: 10, originalPrice: 1333 }
  },
  {
    name: 'Basilic Africain',
    image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=300',
    price: 500,
    unit: 'botte',
    category: 'Herbes',
    rating: 4.5,
    inStock: true
  },
  {
    name: 'Poisson Capitaine',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300',
    price: 3500,
    unit: 'kg',
    category: 'Poissons',
    rating: 4.7,
    inStock: true
  },
  {
    name: 'Huile d\'Arachide',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300',
    price: 2500,
    unit: 'litre',
    category: 'Huiles',
    rating: 4.9,
    inStock: false
  }
];

// Données exemple pour les vidéos
const sampleVideos: Omit<Video, 'id' | 'createdAt'>[] = [
  {
    title: 'Comment préparer le Riz au Gras',
    cloudinaryPublicId: 'sample-video-1',
    duration: '15:30',
    views: 8420,
    likes: 650,
    category: 'Plats traditionnels maliens',
    description: 'Apprenez à préparer le riz au gras traditionnel malien',
    createdBy: 'chef-aminata'
  },
  {
    title: 'Techniques de découpe des légumes locaux',
    cloudinaryPublicId: 'sample-video-2',
    duration: '10:15',
    views: 5200,
    likes: 420,
    category: 'Techniques',
    description: 'Maîtrisez la découpe des légumes locaux maliens',
    createdBy: 'chef-ibrahim'
  }
];

// Fonction pour initialiser la base de données
export const seedDatabase = async () => {
  try {
    console.log('Initialisation de la base de données...');

    // Ajouter les recettes
    for (const recipe of sampleRecipes) {
      await addDoc(collection(db, 'recipes'), {
        ...recipe,
        createdAt: serverTimestamp()
      });
    }

    // Ajouter les produits
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp()
      });
    }

    // Ajouter les vidéos
    for (const video of sampleVideos) {
      await addDoc(collection(db, 'videos'), {
        ...video,
        createdAt: serverTimestamp()
      });
    }

    console.log('Base de données initialisée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  }
};

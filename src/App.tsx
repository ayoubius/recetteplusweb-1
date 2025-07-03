import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthProvider as SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Products from '@/pages/Products';
import Recipes from '@/pages/Recipes';
import Login from '@/pages/Login';
import Register from '@/pages/Signup';
import Profile from '@/pages/Profile';
import ProductDetails from '@/pages/ProductDetail';
import RecipeDetails from '@/pages/RecipeDetail';
import NotFound from '@/pages/NotFound';
import VideoPage from '@/pages/Videos';
import VideoDetails from '@/pages/VideoDetail';
import CartPage from '@/pages/Cart';
import CheckoutPage from '@/pages/Cart';
import OrderConfirmationPage from '@/pages/OrderHistory';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import ProductManagement from '@/pages/admin/ProductManagement';
import RecipeManagement from '@/pages/admin/RecipeManagement';
import VideoManagement from '@/pages/admin/VideoManagement';
import OrderManagement from '@/pages/admin/OrderManagement';
import DeliveryManagement from '@/pages/admin/DeliveryManagement';
import CategoryManagement from '@/pages/admin/CategoryManagement';
import NewsletterManagement from '@/pages/admin/NewsletterManagement';
import PreconfiguredCartManagement from '@/pages/admin/PreconfiguredCartManagement';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              {/* Routes en français pour correspondre aux liens du Header */}
              <Route path="/produits" element={<Products />} />
              <Route path="/produits/:id" element={<ProductDetails />} />
              <Route path="/recettes" element={<Recipes />} />
              <Route path="/recettes/:id" element={<RecipeDetails />} />
              <Route path="/videos" element={<VideoPage />} />
              <Route path="/videos/:id" element={<VideoDetails />} />
              {/* Routes alternatives en anglais pour la compatibilité */}
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/:id" element={<RecipeDetails />} />
              <Route path="/categories/:category" element={<Products />} />
              <Route path="/search" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/panier" element={<CartPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/favoris" element={<NotFound />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route path="/admin/recipes" element={<RecipeManagement />} />
              <Route path="/admin/videos" element={<VideoManagement />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
              <Route path="/admin/delivery" element={<DeliveryManagement />} />
              <Route path="/admin/categories" element={<CategoryManagement />} />
              <Route path="/admin/newsletter" element={<NewsletterManagement />} />
              <Route path="/admin/preconfigured-carts" element={<PreconfiguredCartManagement />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Products from '@/pages/Products';
import Recipes from '@/pages/Recipes';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import ProductDetails from '@/pages/ProductDetails';
import RecipeDetails from '@/pages/RecipeDetails';
import NotFound from '@/pages/NotFound';
import CategoryPage from '@/pages/CategoryPage';
import SearchPage from '@/pages/SearchPage';
import VideoPage from '@/pages/VideoPage';
import VideoDetails from '@/pages/VideoDetails';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';

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
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/:id" element={<RecipeDetails />} />
              <Route path="/videos" element={<VideoPage />} />
              <Route path="/videos/:id" element={<VideoDetails />} />
              <Route path="/categories/:category" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              
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

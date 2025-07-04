import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthProvider as SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import Layout from '@/components/Layout';
import AdminLayout from '@/components/AdminLayout';
import Home from '@/pages/Index';
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
import DeliveryZonesManagement from '@/pages/admin/DeliveryZonesManagement';
import TeamMembersManagement from '@/pages/admin/TeamMembersManagement';
import PermissionsManagement from '@/pages/admin/PermissionsManagement';

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
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              {/* Routes en français pour correspondre aux liens du Header */}
              <Route path="/produits" element={<Layout><Products /></Layout>} />
              <Route path="/produits/:id" element={<Layout><ProductDetails /></Layout>} />
              <Route path="/recettes" element={<Layout><Recipes /></Layout>} />
              <Route path="/recettes/:id" element={<Layout><RecipeDetails /></Layout>} />
              <Route path="/videos" element={<Layout><VideoPage /></Layout>} />
              <Route path="/videos/:id" element={<Layout><VideoDetails /></Layout>} />
              {/* Routes alternatives en anglais pour la compatibilité */}
              <Route path="/products" element={<Layout><Products /></Layout>} />
              <Route path="/products/:id" element={<Layout><ProductDetails /></Layout>} />
              <Route path="/recipes" element={<Layout><Recipes /></Layout>} />
              <Route path="/recipes/:id" element={<Layout><RecipeDetails /></Layout>} />
              <Route path="/categories/:category" element={<Layout><Products /></Layout>} />
              <Route path="/search" element={<Layout><Products /></Layout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
              <Route path="/panier" element={<Layout><CartPage /></Layout>} />
              <Route path="/cart" element={<Layout><CartPage /></Layout>} />
              <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
              <Route path="/order-confirmation" element={<Layout><OrderConfirmationPage /></Layout>} />
              <Route path="/favoris" element={<Layout><NotFound /></Layout>} />
              
              {/* Admin Routes avec AdminLayout */}
              <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
              <Route path="/admin/products" element={<AdminLayout><ProductManagement /></AdminLayout>} />
              <Route path="/admin/recipes" element={<AdminLayout><RecipeManagement /></AdminLayout>} />
              <Route path="/admin/videos" element={<AdminLayout><VideoManagement /></AdminLayout>} />
              <Route path="/admin/orders" element={<AdminLayout><OrderManagement /></AdminLayout>} />
              <Route path="/admin/delivery" element={<AdminLayout><DeliveryManagement /></AdminLayout>} />
              <Route path="/admin/delivery-zones" element={<AdminLayout><DeliveryZonesManagement /></AdminLayout>} />
              <Route path="/admin/categories" element={<AdminLayout><CategoryManagement /></AdminLayout>} />
              <Route path="/admin/newsletter" element={<AdminLayout><NewsletterManagement /></AdminLayout>} />
              <Route path="/admin/preconfigured-carts" element={<AdminLayout><PreconfiguredCartManagement /></AdminLayout>} />
              <Route path="/admin/team-members" element={<AdminLayout><TeamMembersManagement /></AdminLayout>} />
              <Route path="/admin/permissions" element={<AdminLayout><PermissionsManagement /></AdminLayout>} />
              
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;

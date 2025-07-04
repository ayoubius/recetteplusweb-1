
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Videos from "./pages/Videos";
import VideoDetail from "./pages/VideoDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import PhoneAuth from "./pages/PhoneAuth";
import PreconfiguredCarts from "./pages/PreconfiguredCarts";
import PreconfiguredCartDetail from "./pages/PreconfiguredCartDetail";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import DownloadApp from "./pages/DownloadApp";
import MobileRedirect from "./pages/MobileRedirect";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import RecipeManagement from "./pages/admin/RecipeManagement";
import VideoManagement from "./pages/admin/VideoManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import UserManagement from "./pages/admin/UserManagement";
import DeliveryManagement from "./pages/admin/DeliveryManagement";
import DeliveryZonesManagement from "./pages/admin/DeliveryZonesManagement";
import PreconfiguredCartManagement from "./pages/admin/PreconfiguredCartManagement";
import PermissionsManagement from "./pages/admin/PermissionsManagement";
import TeamMembersManagement from "./pages/admin/TeamMembersManagement";
import NewsletterManagement from "./pages/admin/NewsletterManagement";
import DeliveryDashboard from "./pages/DeliveryDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/recettes" element={<Recipes />} />
            <Route path="/recettes/:id" element={<RecipeDetail />} />
            <Route path="/produits" element={<Products />} />
            <Route path="/produits/:id" element={<ProductDetail />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/videos/:id" element={<VideoDetail />} />
            <Route path="/paniers" element={<PreconfiguredCarts />} />
            <Route path="/paniers/:id" element={<PreconfiguredCartDetail />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/favoris" element={<Favorites />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/commandes" element={<OrderHistory />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/inscription" element={<Signup />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verification-email" element={<VerifyEmail />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/phone" element={<PhoneAuth />} />
            <Route path="/download" element={<DownloadApp />} />
            <Route path="/mobile" element={<MobileRedirect />} />
            <Route path="/livraison" element={<DeliveryDashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/produits" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ProductManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/recettes" element={
              <ProtectedRoute>
                <AdminLayout>
                  <RecipeManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/videos" element={
              <ProtectedRoute>
                <AdminLayout>
                  <VideoManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute>
                <AdminLayout>
                  <CategoryManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/commandes" element={
              <ProtectedRoute>
                <AdminLayout>
                  <OrderManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/utilisateurs" element={
              <ProtectedRoute>
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/livraisons" element={
              <ProtectedRoute>
                <AdminLayout>
                  <DeliveryManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/zones-livraison" element={
              <ProtectedRoute>
                <AdminLayout>
                  <DeliveryZonesManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/paniers-predefinis" element={
              <ProtectedRoute>
                <AdminLayout>
                  <PreconfiguredCartManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/permissions" element={
              <ProtectedRoute>
                <AdminLayout>
                  <PermissionsManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/equipe" element={
              <ProtectedRoute>
                <AdminLayout>
                  <TeamMembersManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/newsletter" element={
              <ProtectedRoute>
                <AdminLayout>
                  <NewsletterManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;

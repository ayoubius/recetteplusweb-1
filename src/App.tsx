
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";
import Layout from "./components/Layout";
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
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Routes principales avec Layout (Header + Footer) */}
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/accueil" element={<Layout><Index /></Layout>} />
            <Route path="/home" element={<Layout><Index /></Layout>} />
            
            {/* Pages d'information */}
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/a-propos" element={<Layout><About /></Layout>} />
            
            {/* Recettes */}
            <Route path="/recettes" element={<Layout><Recipes /></Layout>} />
            <Route path="/recettes/:id" element={<Layout><RecipeDetail /></Layout>} />
            <Route path="/recipes" element={<Layout><Recipes /></Layout>} />
            <Route path="/recipes/:id" element={<Layout><RecipeDetail /></Layout>} />
            
            {/* Produits */}
            <Route path="/produits" element={<Layout><Products /></Layout>} />
            <Route path="/produits/:id" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/products" element={<Layout><Products /></Layout>} />
            <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
            
            {/* Vidéos */}
            <Route path="/videos" element={<Layout><Videos /></Layout>} />
            <Route path="/videos/:id" element={<Layout><VideoDetail /></Layout>} />
            
            {/* Paniers préconfigurés */}
            <Route path="/paniers" element={<Layout><PreconfiguredCarts /></Layout>} />
            <Route path="/paniers/:id" element={<Layout><PreconfiguredCartDetail /></Layout>} />
            <Route path="/preconfigured-carts" element={<Layout><PreconfiguredCarts /></Layout>} />
            <Route path="/preconfigured-carts/:id" element={<Layout><PreconfiguredCartDetail /></Layout>} />
            
            {/* Panier principal */}
            <Route path="/panier" element={<Layout><Cart /></Layout>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            
            {/* Favoris */}
            <Route path="/favoris" element={<Layout><Favorites /></Layout>} />
            <Route path="/favorites" element={<Layout><Favorites /></Layout>} />
            
            {/* Profil et compte */}
            <Route path="/profil" element={<Layout><Profile /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/commandes" element={<Layout><OrderHistory /></Layout>} />
            <Route path="/orders" element={<Layout><OrderHistory /></Layout>} />
            <Route path="/order-history" element={<Layout><OrderHistory /></Layout>} />
            
            {/* Authentification */}
            <Route path="/connexion" element={<Layout><Login /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/inscription" element={<Layout><Signup /></Layout>} />
            <Route path="/register" element={<Layout><Signup /></Layout>} />
            <Route path="/signup" element={<Layout><Signup /></Layout>} />
            <Route path="/mot-de-passe-oublie" element={<Layout><ForgotPassword /></Layout>} />
            <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
            <Route path="/reinitialiser-mot-de-passe" element={<Layout><ResetPassword /></Layout>} />
            <Route path="/reset-password" element={<Layout><ResetPassword /></Layout>} />
            <Route path="/verification-email" element={<Layout><VerifyEmail /></Layout>} />
            <Route path="/verify-email" element={<Layout><VerifyEmail /></Layout>} />
            <Route path="/auth/phone" element={<Layout><PhoneAuth /></Layout>} />
            
            {/* Autres pages */}
            <Route path="/download" element={<Layout><DownloadApp /></Layout>} />
            <Route path="/telecharger" element={<Layout><DownloadApp /></Layout>} />
            <Route path="/mobile" element={<Layout><MobileRedirect /></Layout>} />
            <Route path="/livraison" element={<Layout><DeliveryDashboard /></Layout>} />
            <Route path="/delivery" element={<Layout><DeliveryDashboard /></Layout>} />
            
            {/* Routes Admin - Structure corrigée */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="produits" element={<ProductManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="recettes" element={<RecipeManagement />} />
              <Route path="recipes" element={<RecipeManagement />} />
              <Route path="videos" element={<VideoManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="commandes" element={<OrderManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="utilisateurs" element={<UserManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="livraisons" element={<DeliveryManagement />} />
              <Route path="deliveries" element={<DeliveryManagement />} />
              <Route path="zones-livraison" element={<DeliveryZonesManagement />} />
              <Route path="delivery-zones" element={<DeliveryZonesManagement />} />
              <Route path="paniers-predefinis" element={<PreconfiguredCartManagement />} />
              <Route path="preconfigured-carts" element={<PreconfiguredCartManagement />} />
              <Route path="paniers" element={<PreconfiguredCartManagement />} />
              <Route path="permissions" element={<PermissionsManagement />} />
              <Route path="equipe" element={<TeamMembersManagement />} />
              <Route path="team" element={<TeamMembersManagement />} />
              <Route path="newsletter" element={<NewsletterManagement />} />
            </Route>
            
            {/* Route 404 - Avec Layout pour les pages publiques */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

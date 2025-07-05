
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/SupabaseAuthContext";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Videos from "./pages/Videos";
import VideoDetail from "./pages/VideoDetail";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import PhoneAuth from "./pages/PhoneAuth";
import OrderHistory from "./pages/OrderHistory";
import NotFound from "./pages/NotFound";
import PreconfiguredCarts from "./pages/PreconfiguredCarts";
import PreconfiguredCartDetail from "./pages/PreconfiguredCartDetail";
import DownloadApp from "./pages/DownloadApp";
import MobileRedirect from "./pages/MobileRedirect";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import RecipeManagement from "./pages/admin/RecipeManagement";
import VideoManagement from "./pages/admin/VideoManagement";
import UserManagement from "./pages/admin/UserManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import DeliveryManagement from "./pages/admin/DeliveryManagement";
import DeliveryZonesManagement from "./pages/admin/DeliveryZonesManagement";
import NewsletterManagement from "./pages/admin/NewsletterManagement";
import PermissionsManagement from "./pages/admin/PermissionsManagement";
import TeamMembersManagement from "./pages/admin/TeamMembersManagement";
import PreconfiguredCartManagement from "./pages/admin/PreconfiguredCartManagement";
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
            {/* Main Routes */}
            <Route path="/" element={<Layout><Outlet /></Layout>}>
              <Route index element={<Index />} />
              <Route path="accueil" element={<Home />} />
              <Route path="produits" element={<Products />} />
              <Route path="produits/:id" element={<ProductDetail />} />
              <Route path="recettes" element={<Recipes />} />
              <Route path="recettes/:id" element={<RecipeDetail />} />
              <Route path="videos" element={<Videos />} />
              <Route path="videos/:id" element={<VideoDetail />} />
              <Route path="a-propos" element={<About />} />
              <Route path="panier" element={<Cart />} />
              <Route path="paniers-preconfigures" element={<PreconfiguredCarts />} />
              <Route path="paniers-preconfigures/:id" element={<PreconfiguredCartDetail />} />
              <Route path="profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="favoris" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="commandes" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
              <Route path="telecharger-app" element={<DownloadApp />} />
              <Route path="mobile-redirect" element={<MobileRedirect />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Signup />} />
            <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
            <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
            <Route path="/verifier-email" element={<VerifyEmail />} />
            <Route path="/auth/phone" element={<PhoneAuth />} />

            {/* Legacy routes for compatibility */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
              <Route index element={<AdminDashboard />} />
              <Route path="produits" element={<ProductManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="recettes" element={<RecipeManagement />} />
              <Route path="videos" element={<VideoManagement />} />
              <Route path="utilisateurs" element={<UserManagement />} />
              <Route path="commandes" element={<OrderManagement />} />
              <Route path="livraisons" element={<DeliveryManagement />} />
              <Route path="zones-livraison" element={<DeliveryZonesManagement />} />
              <Route path="newsletter" element={<NewsletterManagement />} />
              <Route path="permissions" element={<PermissionsManagement />} />
              <Route path="equipe" element={<TeamMembersManagement />} />
              <Route path="paniers-preconfigures" element={<PreconfiguredCartManagement />} />
              <Route path="preconfigured-carts" element={<PreconfiguredCartManagement />} />
            </Route>

            {/* Delivery Dashboard */}
            <Route path="/livraison" element={<DeliveryDashboard />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;


import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useCurrentUserPermissions } from '@/hooks/useAdminPermissions';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Users, Book, Package, Video, BarChart3, ArrowLeft, Settings, Mail, ShoppingCart, Truck } from 'lucide-react';
import AccessDenied from '@/components/AccessDenied';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const { data: permissions, isLoading: permissionsLoading, error: permissionsError } = useCurrentUserPermissions();
  const location = useLocation();

  if (authLoading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!permissions) {
    return (
      <AccessDenied 
        title="Accès administrateur refusé"
        message="Vous n'avez pas les permissions d'administrateur nécessaires pour accéder à cette section."
        showBackButton={true}
      />
    );
  }

  const hasAnyPermission = permissions.is_super_admin || 
    permissions.can_manage_users || 
    permissions.can_manage_products || 
    permissions.can_manage_recipes || 
    permissions.can_manage_videos || 
    permissions.can_manage_categories || 
    permissions.can_manage_orders ||
    permissions.can_validate_orders ||
    permissions.can_manage_deliveries;

  if (!hasAnyPermission) {
    return (
      <AccessDenied 
        title="Permissions insuffisantes"
        message="Vos permissions d'administrateur ne vous permettent pas d'accéder à cette section."
        showBackButton={true}
      />
    );
  }

  const menuItems = [
    { 
      path: '/admin', 
      icon: BarChart3, 
      label: 'Tableau de bord',
      show: true
    },
    { 
      path: '/admin/users', 
      icon: Users, 
      label: 'Utilisateurs',
      show: permissions.can_manage_users || permissions.is_super_admin
    },
    { 
      path: '/admin/orders', 
      icon: ShoppingCart, 
      label: 'Commandes',
      show: permissions.can_manage_orders || permissions.can_validate_orders || permissions.is_super_admin
    },
    { 
      path: '/admin/delivery', 
      icon: Truck, 
      label: 'Livraisons',
      show: permissions.can_manage_deliveries || permissions.is_super_admin
    },
    { 
      path: '/admin/recipes', 
      icon: Book, 
      label: 'Recettes',
      show: permissions.can_manage_recipes || permissions.is_super_admin
    },
    { 
      path: '/admin/products', 
      icon: Package, 
      label: 'Produits',
      show: permissions.can_manage_products || permissions.is_super_admin
    },
    { 
      path: '/admin/videos', 
      icon: Video, 
      label: 'Vidéos',
      show: permissions.can_manage_videos || permissions.is_super_admin
    },
    { 
      path: '/admin/categories', 
      icon: Settings, 
      label: 'Catégories',
      show: permissions.can_manage_categories || permissions.is_super_admin
    },
    { 
      path: '/admin/newsletter', 
      icon: Mail, 
      label: 'Newsletter',
      show: permissions.can_manage_users || permissions.is_super_admin
    },
  ].filter(item => item.show);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar - Mobile/Desktop Responsive */}
      <div className="w-full lg:w-80 bg-white shadow-lg lg:sticky lg:top-0 lg:h-screen">
        <div className="p-3 sm:p-4 lg:p-6 h-full">
          <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-orange-500 mr-2 lg:mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">Administration</h1>
              {permissions.is_super_admin && (
                <span className="text-xs text-orange-600 font-medium">Super Admin</span>
              )}
            </div>
          </div>
          
          <nav className="space-y-1 lg:space-y-2 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-2 sm:px-3 lg:px-4 py-2 sm:py-3 rounded-lg transition-colors text-xs sm:text-sm lg:text-base ${
                    isActive 
                      ? 'bg-orange-100 text-orange-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5 mr-2 lg:mr-3 flex-shrink-0" />
                  <span className="truncate text-xs sm:text-sm lg:text-base">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-4 sm:mt-6 lg:mt-8 pt-3 sm:pt-4 border-t">
            <Link to="/">
              <Button variant="outline" className="w-full text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10">
                <ArrowLeft className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 flex-shrink-0" />
                <span className="truncate">Retour au site</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - Fully Responsive */}
      <div className="flex-1 p-3 sm:p-4 lg:p-8 overflow-auto min-w-0">
        <div className="max-w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

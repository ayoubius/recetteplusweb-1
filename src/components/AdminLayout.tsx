
import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useCurrentUserPermissions } from '@/hooks/useAdminPermissions';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Users, Book, Package, Video, BarChart3, ArrowLeft, Settings, Mail, ShoppingCart, Truck, Menu, X } from 'lucide-react';
import AccessDenied from '@/components/AccessDenied';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const { data: permissions, isLoading: permissionsLoading, error: permissionsError } = useCurrentUserPermissions();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      path: '/admin/utilisateurs', 
      icon: Users, 
      label: 'Utilisateurs',
      show: permissions.can_manage_users || permissions.is_super_admin
    },
    { 
      path: '/admin/commandes', 
      icon: ShoppingCart, 
      label: 'Commandes',
      show: permissions.can_manage_orders || permissions.can_validate_orders || permissions.is_super_admin
    },
    { 
      path: '/admin/livraisons', 
      icon: Truck, 
      label: 'Livraisons',
      show: permissions.can_manage_deliveries || permissions.is_super_admin
    },
    { 
      path: '/admin/recettes', 
      icon: Book, 
      label: 'Recettes',
      show: permissions.can_manage_recipes || permissions.is_super_admin
    },
    { 
      path: '/admin/produits', 
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
      path: '/admin/preconfigured-carts', 
      icon: ShoppingCart, 
      label: 'Paniers Préconfigurés',
      show: permissions.can_manage_products || permissions.is_super_admin
    },
    { 
      path: '/admin/categories', 
      icon: Settings, 
      label: 'Catégories',
      show: permissions.can_manage_categories || permissions.is_super_admin
    },
    { 
      path: '/admin/equipe', 
      icon: Users, 
      label: 'Équipe',
      show: permissions.can_manage_users || permissions.is_super_admin
    },
    { 
      path: '/admin/newsletter', 
      icon: Mail, 
      label: 'Newsletter',
      show: permissions.can_manage_users || permissions.is_super_admin
    }
  ].filter(item => item.show);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-orange-500 mr-2" />
            <h1 className="text-lg font-bold text-gray-900">Admin</h1>
            {permissions.is_super_admin && (
              <span className="ml-2 text-xs text-orange-600 font-medium">Super</span>
            )}
          </div>
        </div>
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Site
          </Button>
        </Link>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={closeSidebar}
          />
          
          {/* Sidebar */}
          <div className="relative flex flex-col w-80 max-w-[80vw] bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-orange-500 mr-2" />
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Administration</h1>
                  {permissions.is_super_admin && (
                    <span className="text-xs text-orange-600 font-medium">Super Admin</span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeSidebar}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeSidebar}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-lg transition-colors text-sm",
                      isActive 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="p-4 border-t">
              <Link to="/" onClick={closeSidebar}>
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-80 bg-white shadow-lg sticky top-0 h-screen">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center mb-8">
              <Shield className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Administration</h1>
                {permissions.is_super_admin && (
                  <span className="text-xs text-orange-600 font-medium">Super Admin</span>
                )}
              </div>
            </div>
            
            <nav className="space-y-2 flex-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-lg transition-colors text-base",
                      isActive 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="mt-8 pt-4 border-t">
              <Link to="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au site
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

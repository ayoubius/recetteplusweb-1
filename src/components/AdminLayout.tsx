
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Truck, 
  FileText,
  ChefHat,
  Video,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  const navigation = [
    { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
    { name: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users },
    { name: 'Produits', href: '/admin/produits', icon: Package },
    { name: 'Recettes', href: '/admin/recettes', icon: ChefHat },
    { name: 'Vidéos', href: '/admin/videos', icon: Video },
    { name: 'Paniers préconfigurés', href: '/admin/paniers', icon: ShoppingCart },
    { name: 'Commandes', href: '/admin/commandes', icon: FileText },
    { name: 'Livraisons', href: '/admin/livraisons', icon: Truck },
    { name: 'Équipe', href: '/admin/equipe', icon: Users },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-orange-600">Admin Panel</h1>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive(item.href)
                          ? 'bg-orange-100 border-orange-500 text-orange-700 border-r-2'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <Icon
                        className={`${
                          isActive(item.href) ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 h-5 w-5`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="flex-shrink-0 px-2">
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-orange-600">Admin Panel</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`${
                        isActive(item.href)
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    >
                      <Icon
                        className={`${
                          isActive(item.href) ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-4 h-6 w-6`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 px-2 pb-4">
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-2 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, User, ShoppingCart, Heart, LogOut, Menu, X, Shield } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useMainCart } from '@/hooks/useSupabaseCart';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import GlobalSearchModal from '@/components/GlobalSearchModal';
import { useSearchShortcut } from '@/hooks/useSearchShortcut';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { data: userProfile } = useUserProfile();
  const { cartItems } = useMainCart();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  const isAdmin = userProfile?.role === 'admin';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const cartItemsCount = cartItems?.length || 0;

  const NavigationLinks = ({ mobile = false, onLinkClick = () => {} }) => (
    <>
      <Link 
        to="/about" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-orange-500",
          isActive("/about") ? "text-orange-500" : "text-gray-600",
          mobile && "block py-2 text-base"
        )}
        onClick={onLinkClick}
      >
        À propos
      </Link>
      <Link 
        to="/recettes" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-orange-500",
          isActive("/recettes") ? "text-orange-500" : "text-gray-600",
          mobile && "block py-2 text-base"
        )}
        onClick={onLinkClick}
      >
        Recettes
      </Link>
      <Link 
        to="/produits" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-orange-500",
          isActive("/produits") ? "text-orange-500" : "text-gray-600",
          mobile && "block py-2 text-base"
        )}
        onClick={onLinkClick}
      >
        Produits
      </Link>
      <Link 
        to="/videos" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-orange-500",
          isActive("/videos") ? "text-orange-500" : "text-gray-600",
          mobile && "block py-2 text-base"
        )}
        onClick={onLinkClick}
      >
        Vidéos
      </Link>
    </>
  );
  
  // Add keyboard shortcut
  useSearchShortcut(() => setIsSearchModalOpen(true));

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/fd4068e4-5395-416a-a0d9-2f2084813da4.png" 
                alt="Recette+" 
                className="h-8 sm:h-12 w-auto"
              />
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              <NavigationLinks />
            </nav>

            {/* Search Button - Replaces the search bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <Button
                variant="outline"
                onClick={() => setIsSearchModalOpen(true)}
                className="w-full justify-start text-gray-500 font-normal h-10 px-4 bg-gray-50 hover:bg-gray-100 border-gray-200"
              >
                <Search className="h-4 w-4 mr-3" />
                <span>Rechercher des recettes, produits...</span>
                <div className="ml-auto">
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Search button for mobile */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Favorites - Desktop only */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex"
                onClick={() => navigate('/favoris')}
              >
                <Heart className="h-5 w-5" />
              </Button>
              
              {/* Cart with badge */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/panier')}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 bg-orange-500 hover:bg-orange-600"
                  >
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </Badge>
                )}
              </Button>
              
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      {currentUser.user_metadata?.avatar_url ? (
                        <img 
                          src={currentUser.user_metadata.avatar_url} 
                          alt="Avatar" 
                          className="h-6 w-6 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{currentUser.user_metadata?.display_name || currentUser.user_metadata?.full_name || 'Utilisateur'}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Mon profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/panier')}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>Mon panier</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/favoris')} className="md:hidden">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Mes favoris</span>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Administration</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Se déconnecter</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="icon" onClick={() => navigate('/login')}>
                    <User className="h-5 w-5" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="bg-orange-500 hover:bg-orange-600 text-white hidden sm:inline-flex text-sm px-3 py-2"
                  >
                    Connexion
                  </Button>
                </>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 mt-6">
                    {/* Navigation Links */}
                    <nav className="flex flex-col space-y-2">
                      <NavigationLinks 
                        mobile={true} 
                        onLinkClick={() => setIsMenuOpen(false)} 
                      />
                    </nav>

                    {/* User Actions for mobile */}
                    {!currentUser && (
                      <div className="pt-4 border-t">
                        <Button 
                          onClick={() => {
                            navigate('/login');
                            setIsMenuOpen(false);
                          }}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          Connexion
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal 
        open={isSearchModalOpen} 
        onOpenChange={setIsSearchModalOpen} 
      />
    </>
  );
};

export default Header;

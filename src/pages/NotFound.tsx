
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center relative overflow-hidden">
      {/* Animation de fond avec des cercles flottants */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce" style={{ animationDelay: '4s' }}></div>
      </div>

      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative z-10 animate-fade-in">
        <CardContent className="p-8 text-center">
          {/* Icône 404 avec animation */}
          <div className="mb-6 relative">
            <div className="text-8xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
              404
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-500 rounded-full animate-ping opacity-75"></div>
          </div>

          {/* Titre avec gradient */}
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Oops! Page introuvable
          </h1>

          {/* Message descriptif */}
          <p className="text-lg text-gray-600 mb-2">
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Route tentée : <code className="bg-gray-100 px-2 py-1 rounded text-orange-600">{location.pathname}</code>
          </p>

          {/* Boutons d'action */}
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Home className="w-5 h-5 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-colors"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              
              <Link to="/recettes" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-colors"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Explorer
                </Button>
              </Link>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-100">
            <h3 className="font-semibold text-orange-800 mb-2">Suggestions :</h3>
            <div className="text-sm text-orange-700 space-y-1">
              <Link to="/recettes" className="block hover:underline">🍳 Découvrir nos recettes</Link>
              <Link to="/produits" className="block hover:underline">🛒 Parcourir les produits</Link>
              <Link to="/videos" className="block hover:underline">📺 Regarder nos vidéos</Link>
              <Link to="/paniers" className="block hover:underline">🛍️ Voir les paniers préconfigurés</Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

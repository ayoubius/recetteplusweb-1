import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ChefHat, Package, Video, Users, Star, Clock, ArrowRight, Heart, ShoppingCart, Shield, Smartphone, Download } from 'lucide-react';
const Index = () => {
  const {
    currentUser
  } = useAuth();
  const {
    data: userProfile
  } = useUserProfile();
  const features = [{
    icon: ChefHat,
    title: "Recettes Délicieuses",
    description: "Découvrez des milliers de recettes créées par notre communauté de passionnés",
    link: "/recettes",
    color: "text-orange-500",
    stats: "500+ recettes"
  }, {
    icon: Package,
    title: "Produits Frais",
    description: "Commandez des ingrédients de qualité directement chez vous avec notre boutique",
    link: "/produits",
    color: "text-green-500",
    stats: "200+ produits"
  }, {
    icon: Video,
    title: "Vidéos Tutoriels",
    description: "Apprenez avec nos vidéos pas à pas pour maîtriser chaque technique culinaire",
    link: "/videos",
    color: "text-blue-500",
    stats: "100+ vidéos"
  }];
  const quickStats = [{
    label: "Recettes",
    value: "500+",
    icon: ChefHat,
    color: "text-orange-500"
  }, {
    label: "Produits",
    value: "200+",
    icon: Package,
    color: "text-green-500"
  }, {
    label: "Vidéos",
    value: "100+",
    icon: Video,
    color: "text-blue-500"
  }, {
    label: "Utilisateurs",
    value: "1000+",
    icon: Users,
    color: "text-purple-500"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <Badge variant="outline" className="mb-4 text-orange-600 border-orange-200">
              🍽️ Plateforme de cuisine complète
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Bienvenue sur <span className="text-orange-500">Recette+</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              La plateforme tout-en-un pour les passionnés de cuisine. Découvrez, créez et partagez des recettes exceptionnelles, 
              commandez vos ingrédients et apprenez avec nos vidéos tutoriels.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {!currentUser ? <>
                <Link to="/inscription">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg">
                    Commencer maintenant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/connexion">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-orange-200 hover:bg-orange-50">
                    Se connecter
                  </Button>
                </Link>
              </> : <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/recettes">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg">
                    Explorer les recettes
                    <ChefHat className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                {userProfile?.role === 'admin' && <Link to="/admin">
                    <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-orange-200 hover:bg-orange-50">
                      <Shield className="mr-2 h-5 w-5" />
                      Administration
                    </Button>
                  </Link>}
              </div>}
          </div>

          {/* Mobile App Promotion - Responsive */}
          <div className="mb-12 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 rounded-2xl md:rounded-3xl p-4 md:p-8 text-white shadow-2xl mx-4 md:mx-0">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0">
              {/* Icon and Text */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 text-center sm:text-left">
                <div className="bg-white/20 rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm">
                  <Smartphone className="h-8 w-8 md:h-12 md:w-12 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">Application Mobile Disponible !</h3>
                  <p className="text-sm md:text-lg opacity-90">
                    Emportez vos recettes partout avec vous ! Cuisinez même hors connexion.
                  </p>
                </div>
              </div>
              
              {/* Download Button */}
              <div className="flex-shrink-0">
            <Link to="/telecharger-app">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-50 hover:text-orange-700 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold shadow-lg">
                <Download className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                Télécharger l'app
              </Button>
            </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-orange-100">
                  <CardContent className="p-6">
                    <IconComponent className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour cuisiner
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète pour les passionnés de cuisine, de l'inspiration à la réalisation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-orange-100">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`h-8 w-8 ${feature.color}`} />
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.stats}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                    <Link to={feature.link}>
                      <Button variant="outline" className="w-full hover:bg-orange-50 border-orange-200">
                        Découvrir
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* User Dashboard Preview */}
      {currentUser && <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Bonjour {userProfile?.display_name || currentUser.email?.split('@')[0]} ! 👋
              </h2>
              <p className="text-gray-600">Que souhaitez-vous faire aujourd'hui ?</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/recettes">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 border-orange-100">
                  <CardContent className="p-6 text-center">
                    <ChefHat className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                    <h3 className="font-semibold mb-2">Parcourir les recettes</h3>
                    <p className="text-sm text-gray-600">Découvrez de nouvelles idées culinaires</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/produits">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 border-green-100">
                  <CardContent className="p-6 text-center">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h3 className="font-semibold mb-2">Faire ses courses</h3>
                    <p className="text-sm text-gray-600">Commandez vos ingrédients frais</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/favoris">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 border-red-100">
                  <CardContent className="p-6 text-center">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-red-500" />
                    <h3 className="font-semibold mb-2">Mes favoris</h3>
                    <p className="text-sm text-gray-600">Retrouvez vos recettes préférées</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/telecharger-app">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 border-blue-100">
                  <CardContent className="p-6 text-center">
                    <Smartphone className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                    <h3 className="font-semibold mb-2">App Mobile</h3>
                    <p className="text-sm text-gray-600">Téléchargez notre application</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>}

      {/* CTA Section */}
      {!currentUser && <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Rejoignez notre communauté de passionnés
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Créez votre compte gratuit et commencez à partager vos créations culinaires dès maintenant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/inscription">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                  S'inscrire gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/telecharger-app">
                <Button size="lg" variant="outline" className="border-white hover:bg-white/10 px-8 py-4 text-lg text-gray-800">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Télécharger l'app
                </Button>
              </Link>
            </div>
          </div>
        </section>}
    </div>;
};
export default Index;
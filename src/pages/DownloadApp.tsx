
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Download, 
  Star, 
  Users, 
  Shield, 
  Zap,
  ChefHat,
  ShoppingCart,
  Heart,
  Play
} from 'lucide-react';

const DownloadApp = () => {
  const features = [
    {
      icon: ChefHat,
      title: 'Recettes Hors Ligne',
      description: 'Accédez à toutes vos recettes favorites même sans connexion internet'
    },
    {
      icon: ShoppingCart,
      title: 'Liste de Courses Intelligente',
      description: 'Générez automatiquement votre liste de courses à partir de vos recettes'
    },
    {
      icon: Heart,
      title: 'Favoris Synchronisés',
      description: 'Retrouvez vos recettes et vidéos favorites sur tous vos appareils'
    },
    {
      icon: Play,
      title: 'Vidéos Haute Qualité',
      description: 'Regardez nos tutoriels vidéo en streaming optimisé sur mobile'
    },
    {
      icon: Zap,
      title: 'Notifications Push',
      description: 'Recevez les nouvelles recettes et offres spéciales en temps réel'
    },
    {
      icon: Shield,
      title: 'Sécurisé & Privé',
      description: 'Vos données sont protégées avec le plus haut niveau de sécurité'
    }
  ];

  const stats = [
    { number: '10k+', label: 'Téléchargements' },
    { number: '4.8', label: 'Note moyenne' },
    { number: '500+', label: 'Recettes' },
    { number: '100+', label: 'Vidéos' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <ChefHat className="h-16 w-16 text-white" />
              </div>
              <Badge className="absolute -top-2 -right-2 bg-green-500">Nouveau</Badge>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
            Recette+ Mobile
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Emportez toutes vos recettes favorites partout avec vous. L'application mobile Recette+ 
            vous offre une expérience culinaire complète, même hors ligne.
          </p>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 h-14 px-8">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Télécharger sur</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </div>
            </Button>
            
            <Button size="lg" className="bg-green-600 text-white hover:bg-green-700 h-14 px-8">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Disponible sur</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </div>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Pourquoi télécharger l'application ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Screenshots Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Aperçu de l'application
          </h2>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
              <div className="relative">
                <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
                  <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl h-96 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <ChefHat className="h-16 w-16 mx-auto mb-4 text-orange-500" />
                      <p className="text-sm">Écran Recettes</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl h-96 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <Play className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                      <p className="text-sm">Lecteur Vidéo</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
                  <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl h-96 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-green-500" />
                      <p className="text-sm">Liste de Courses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-white">
          <Smartphone className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Prêt à cuisiner ?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà transformé leur façon de cuisiner 
            avec Recette+. Téléchargez maintenant et commencez votre aventure culinaire !
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100 h-14 px-8">
              <Download className="h-5 w-5 mr-2" />
              Télécharger maintenant
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 h-14 px-8">
              <Star className="h-5 w-5 mr-2" />
              Voir les avis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;

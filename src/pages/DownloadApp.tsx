
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Star, Download, ArrowLeft, Shield, Zap, Heart, Users, Sparkles, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const DownloadApp = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "Sécurité renforcée",
      description: "Authentification par SMS et chiffrement de bout en bout",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Accès hors ligne",
      description: "Consultez vos recettes favorites même sans connexion",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Notifications intelligentes",
      description: "Recevez des alertes personnalisées pour vos recettes préférées",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <Users className="h-6 w-6 text-purple-500" />,
      title: "Communauté active",
      description: "Partagez vos créations et découvrez celles des autres chefs",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-300/20 to-red-300/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img 
                  src="/lovable-uploads/fd4068e4-5395-416a-a0d9-2f2084813da4.png" 
                  alt="Recette+" 
                  className="h-32 w-auto drop-shadow-lg"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              Téléchargez Recette+
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Emportez toutes vos recettes favorites dans votre poche avec notre application mobile disponible
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 mb-12">
            {/* App Preview */}
            <Card className="overflow-hidden shadow-2xl border-0 transform hover:scale-[1.02] transition-all duration-500 animate-fade-in">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-10 text-white text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-32 h-32 mx-auto mb-6 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                      <Smartphone className="h-16 w-16 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Recette+ Mobile</h2>
                    <div className="flex items-center justify-center space-x-3 mb-6">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current text-yellow-300" />
                        ))}
                      </div>
                      <span className="text-lg font-semibold">4.8/5</span>
                      <span className="text-sm opacity-75">(2.5k avis)</span>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-semibold">
                      <Phone className="h-4 w-4 mr-2" />
                      Disponible maintenant
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="shadow-xl border-0 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                  <Sparkles className="h-6 w-6 mr-3 text-orange-500" />
                  Fonctionnalités exclusives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="group flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]">
                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Realistic Illustration */}
          <div className="mb-12">
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-96 bg-gradient-to-r from-orange-100 to-red-100">
                  <img 
                    src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&h=400&fit=crop"
                    alt="Plat traditionnel malien"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <div className="p-8 text-white">
                      <h3 className="text-2xl font-bold mb-2">Découvrez la cuisine malienne authentique</h3>
                      <p className="text-lg opacity-90">Des recettes traditionnelles adaptées à votre quotidien</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Download Buttons */}
          <Card className="mb-12 shadow-xl border-0 animate-fade-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">Téléchargez maintenant</CardTitle>
              <p className="text-lg text-gray-600">Application disponible sur toutes les plateformes</p>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
                <Button 
                  size="lg" 
                  className="bg-black hover:bg-gray-800 text-white h-20 justify-start relative overflow-hidden group transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-center space-x-4 relative z-10">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#000">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm opacity-75">Télécharger sur</div>
                      <div className="font-bold text-lg">App Store</div>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white h-20 justify-start relative overflow-hidden group transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-center space-x-4 relative z-10">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92z" fill="#32D74B"/>
                        <path d="M20.408 10.46L13.792 12l6.616 1.54c.638.149 1.092.25 1.092 1 0 .75-.454.851-1.092 1L13.792 12z" fill="#32D74B"/>
                        <path d="M13.792 12L3.61 1.814a1.001 1.001 0 011.391-.205L20.408 10.46 13.792 12z" fill="#32D74B"/>
                        <path d="M13.792 12l6.616 1.54L5.001 22.391a1.002 1.002 0 01-1.391-.205L13.792 12z" fill="#32D74B"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm opacity-75">Disponible sur</div>
                      <div className="font-bold text-lg">Google Play</div>
                    </div>
                  </div>
                </Button>
              </div>
              
              <div className="text-center mt-8">
                <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 px-6 py-3 text-lg font-semibold">
                  <Download className="h-5 w-5 mr-2" />
                  Application disponible dès maintenant
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Notification Card */}
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 shadow-xl animate-fade-in">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-orange-900 text-xl mb-2">Rejoignez notre communauté</h3>
                  <p className="text-orange-700 mb-4 text-lg leading-relaxed">
                    Découvrez une expérience culinaire unique avec des recettes authentiques du Mali et d'ailleurs, 
                    disponible maintenant sur votre mobile.
                  </p>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 transform hover:scale-[1.02] transition-all duration-300">
                    <Smartphone className="h-5 w-5 mr-2" />
                    Télécharger maintenant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <Link 
              to="/" 
              className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadApp;

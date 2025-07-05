
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Award, Heart, MapPin, Phone, Mail, Clock, Shield, Utensils } from 'lucide-react';
import { useTeamMembers } from '@/hooks/useTeamMembers';

const About = () => {
  const { data: teamMembers, isLoading: teamLoading } = useTeamMembers();

  const values = [
    {
      icon: Heart,
      title: "Passion culinaire",
      description: "Préservation et célébration de la richesse culinaire malienne avec authenticité"
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Connecter les familles maliennes et la diaspora autour de leur patrimoine culinaire"
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Technologie moderne au service des traditions culinaires ancestrales"
    },
    {
      icon: Shield,
      title: "Qualité",
      description: "Ingrédients authentiques et recettes traditionnelles vérifiées"
    }
  ];

  const features = [
    {
      icon: Utensils,
      title: "Recettes Authentiques",
      description: "Collection complète de recettes traditionnelles maliennes avec instructions détaillées"
    },
    {
      icon: Clock,
      title: "Livraison Express",
      description: "Service de livraison d'ingrédients frais directement à votre domicile"
    },
    {
      icon: Users,
      title: "Tutoriels Vidéo",
      description: "Apprentissage visuel avec nos chefs experts en cuisine malienne"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center mb-8">
            <img 
              src="/lovable-uploads/fd4068e4-5395-416a-a0d9-2f2084813da4.png" 
              alt="Recette+" 
              className="h-24 w-auto"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#F97316] to-red-600 bg-clip-text text-transparent mb-8">
            Recette+
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            La plateforme numérique de référence pour la cuisine malienne authentique
          </p>
        </div>

        {/* Mission & Vision Section with Chef Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-4">Notre Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Recette+ révolutionne l'accès à la cuisine malienne traditionnelle en combinant 
                  patrimoine culinaire et innovation technologique. Notre plateforme connecte les 
                  familles maliennes du monde entier avec leurs racines gastronomiques.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Nous préservons les techniques ancestrales tout en facilitant leur transmission 
                  aux nouvelles générations grâce à des outils numériques modernes.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <img 
                src="/chef.svg" 
                alt="Chef cuisinier" 
                className="w-full max-w-md h-auto drop-shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-[#F97316] to-red-500 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div>
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Nos Valeurs Fondamentales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border-0 bg-white/90 backdrop-blur-sm group">
                <CardHeader>
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#F97316] to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section with Family Meal Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src="/family-meal.svg" 
                alt="Repas en famille" 
                className="w-full max-w-md h-auto drop-shadow-2xl"
              />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-15 blur-2xl"></div>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Nos Services</h2>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-[#F97316] bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#F97316] to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Story Section */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center text-gray-900 mb-4">Notre Histoire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Fondé en 2024 à Bamako, Recette+ est né de la vision d'une équipe passionnée 
                  de technologues et chefs maliens. Nous avons identifié un besoin crucial : 
                  faciliter l'accès aux traditions culinaires maliennes pour les familles 
                  dispersées dans le monde.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Notre plateforme répond aux défis modernes : difficulté d'accès aux ingrédients 
                  authentiques, transmission des savoir-faire culinaires, et maintien des liens 
                  culturels malgré la distance géographique.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Aujourd'hui, Recette+ rassemble une communauté grandissante d'amoureux de la 
                  cuisine malienne, unis par la passion du partage et de l'authenticité.
                </p>
              </div>
              <div className="flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop" 
                  alt="Cuisine malienne traditionnelle" 
                  className="rounded-2xl shadow-2xl w-full max-w-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Section - Using Database Data */}
        <div>
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Notre Équipe d'Experts</h2>
          
          {teamLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers?.map((member) => (
                <Card key={member.id} className="text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm group">
                  <CardHeader>
                    <div className="w-32 h-32 mx-auto mb-6 relative">
                      {member.photo_url ? (
                        <img 
                          src={member.photo_url} 
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-[#F97316] to-red-500 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <Users className="h-16 w-16 text-white" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">{member.name}</CardTitle>
                    <Badge className="bg-[#F97316]/10 text-[#F97316] hover:bg-[#F97316]/20 border-[#F97316]/20">
                      {member.role}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Contact Section */}
        <Card className="shadow-2xl border-0 bg-gradient-to-r from-[#F97316] to-red-500 text-white">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center mb-4">Contactez-nous</CardTitle>
            <CardDescription className="text-center text-lg text-white/90">
              Nous sommes à votre écoute pour toute question ou suggestion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center space-y-4 p-6 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Siège social</h3>
                  <p className="text-white/90">ACI 2000, Bamako<br />République du Mali</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Téléphone</h3>
                  <p className="text-white/90">+223 78 21 63 98</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Email</h3>
                  <p className="text-white/90">contact@recette-plus.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;

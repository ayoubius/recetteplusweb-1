
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ChefHat, ShoppingCart, Play, Heart, Star, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSupabaseRecipes } from '@/hooks/useSupabaseRecipes';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { useSupabaseVideos } from '@/hooks/useSupabaseVideos';
import FeaturedCartsSection from '@/components/FeaturedCartsSection';

const Home = () => {
  const { data: recipes = [], isLoading: recipesLoading } = useSupabaseRecipes();
  const { data: products = [], isLoading: productsLoading } = useSupabaseProducts();
  const { data: videos = [], isLoading: videosLoading } = useSupabaseVideos();

  // Get featured content
  const featuredRecipes = recipes.slice(0, 3);
  const featuredProducts = products.filter(p => p.in_stock).slice(0, 4);
  const featuredVideos = videos.slice(0, 3);

  const stats = [
    { number: recipes.length, label: "Recettes", icon: ChefHat },
    { number: products.length, label: "Produits", icon: ShoppingCart },
    { number: videos.length, label: "Vidéos", icon: Play },
    { number: "1000+", label: "Utilisateurs", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
              Découvrez l'art culinaire
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Des recettes authentiques, des produits frais et des vidéos inspirantes pour révolutionner votre cuisine
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/recettes">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
                  Explorer les recettes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/produits">
                <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-orange-300 hover:bg-orange-50">
                  Découvrir les produits
                  <ShoppingCart className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <stat.icon className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Carts Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <FeaturedCartsSection />
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recettes populaires</h2>
            <Link to="/recettes">
              <Button variant="outline">
                Voir toutes les recettes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {recipesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe) => (
                <Card key={recipe.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={recipe.image || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=500'} 
                      alt={recipe.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2 bg-orange-500">
                      {recipe.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {recipe.cook_time} min
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {recipe.servings} pers.
                      </div>
                    </div>
                    <Link to={`/recettes/${recipe.id}`}>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        Voir la recette
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Produits du moment</h2>
            <Link to="/produits">
              <Button variant="outline">
                Voir tous les produits
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image || '/placeholder.svg'} 
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2 bg-green-500">
                      {product.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < (product.rating || 0) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">({product.rating || 0})</span>
                    </div>
                    <div className="text-lg font-bold text-orange-500 mb-3">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                        minimumFractionDigits: 0,
                      }).format(product.price)}
                    </div>
                    <Link to={`/produits/${product.id}`}>
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        Voir le produit
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Videos */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Vidéos à la une</h2>
            <Link to="/videos">
              <Button variant="outline">
                Voir toutes les vidéos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {videosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredVideos.map((video) => (
                <Card key={video.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={video.thumbnail || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'} 
                      alt={video.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      {video.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Play className="h-4 w-4 mr-1" />
                        {video.views || 0} vues
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {video.likes || 0}
                      </div>
                    </div>
                    <Link to={`/videos/${video.id}`}>
                      <Button className="w-full bg-red-500 hover:bg-red-600">
                        Regarder
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à commencer votre aventure culinaire ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez notre communauté et découvrez des saveurs extraordinaires
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/inscription">
              <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 text-lg">
                S'inscrire gratuitement
              </Button>
            </Link>
            <Link to="/recettes">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 text-lg">
                Explorer maintenant
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

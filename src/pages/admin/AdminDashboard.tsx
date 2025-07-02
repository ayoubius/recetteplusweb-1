
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Book, Package, Video, TrendingUp, ShoppingCart, Clock, Star, Eye, Plus } from 'lucide-react';
import { useSupabaseRecipes } from '@/hooks/useSupabaseRecipes';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { useSupabaseVideos } from '@/hooks/useSupabaseVideos';
import { useSupabaseUsers } from '@/hooks/useSupabaseUsers';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminDashboard = () => {
  const { data: recipes, isLoading: recipesLoading } = useSupabaseRecipes();
  const { data: products, isLoading: productsLoading } = useSupabaseProducts();
  const { data: videos, isLoading: videosLoading } = useSupabaseVideos();
  const { data: users, isLoading: usersLoading } = useSupabaseUsers();

  const isLoading = recipesLoading || productsLoading || videosLoading || usersLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Calculate statistics
  const totalRecipes = recipes?.length || 0;
  const totalProducts = products?.length || 0;
  const totalVideos = videos?.length || 0;
  const totalUsers = users?.length || 0;
  const adminUsers = users?.filter(u => u.role === 'admin').length || 0;
  const productsInStock = products?.filter(p => p.in_stock).length || 0;
  const averageRating = totalRecipes > 0 ? (recipes?.reduce((acc, recipe) => acc + (recipe.rating || 0), 0) / totalRecipes) : 0;
  const totalViews = videos?.reduce((acc, video) => acc + (video.views || 0), 0) || 0;

  const stats = [
    {
      title: 'Recettes totales',
      value: totalRecipes,
      icon: Book,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: `${averageRating.toFixed(1)}/5 ⭐`,
      changeType: 'positive'
    },
    {
      title: 'Produits en stock',
      value: `${productsInStock}/${totalProducts}`,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: `${((productsInStock / Math.max(totalProducts, 1)) * 100).toFixed(0)}% disponible`,
      changeType: 'neutral'
    },
    {
      title: 'Vidéos publiées',
      value: totalVideos,
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: `${totalViews.toLocaleString()} vues`,
      changeType: 'positive'
    },
    {
      title: 'Utilisateurs actifs',
      value: totalUsers,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: `${adminUsers} admin(s)`,
      changeType: 'positive'
    }
  ];

  // Recent activity based on creation dates
  const recentActivity = [
    ...(recipes?.slice(0, 2).map(recipe => ({
      type: 'recipe',
      title: `Nouvelle recette "${recipe.title}"`,
      time: format(new Date(recipe.created_at), "'Il y a' dd 'jours'", { locale: fr }),
      status: 'success'
    })) || []),
    ...(videos?.slice(0, 2).map(video => ({
      type: 'video',
      title: `Vidéo "${video.title}" publiée`,
      time: format(new Date(video.created_at), "'Il y a' dd 'jours'", { locale: fr }),
      status: 'success'
    })) || []),
    ...(products?.filter(p => !p.in_stock).slice(0, 1).map(product => ({
      type: 'product',
      title: `Stock de "${product.name}" épuisé`,
      time: 'À vérifier',
      status: 'warning'
    })) || [])
  ].slice(0, 4);

  const quickActions = [
    { title: 'Ajouter une recette', link: '/admin/recipes', icon: Book },
    { title: 'Gérer les produits', link: '/admin/products', icon: Package },
    { title: 'Publier une vidéo', link: '/admin/videos', icon: Video },
    { title: 'Voir les utilisateurs', link: '/admin/users', icon: Users }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const estimatedRevenue = products?.reduce((acc, product) => acc + (product.price || 0), 0) || 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Tableau de bord</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Vue d'ensemble de votre plateforme Recette+</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
          <Button variant="outline" className="text-xs sm:text-sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Rapports</span>
            <span className="sm:hidden">Stats</span>
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Actions rapides</span>
            <span className="sm:hidden">Actions</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid - Fully Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-xs mt-1 truncate ${
                      stat.changeType === 'positive' ? 'text-green-600' :
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor} flex-shrink-0`}>
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.link}>
                  <div className="p-2 sm:p-3 lg:p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-orange-500 mb-1 sm:mb-2" />
                    <p className="text-xs sm:text-sm font-medium leading-tight">{action.title}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid - Mobile First */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge variant={
                    activity.status === 'success' ? 'default' :
                    activity.status === 'warning' ? 'destructive' : 'secondary'
                  }>
                    {activity.type}
                  </Badge>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Aperçu des performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Vues totales</span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {totalViews.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Valeur catalogue</span>
                </div>
                <span className="text-xl font-bold text-green-600">
                  {formatPrice(estimatedRevenue)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Utilisateurs actifs</span>
                </div>
                <span className="text-xl font-bold text-purple-600">{totalUsers}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Overview - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recettes populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recipes && recipes.slice(0, 3).map((recipe) => (
                <div key={recipe.id} className="flex items-center space-x-3">
                  {recipe.image && (
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{recipe.title}</p>
                    <div className="flex items-center space-x-2">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">{recipe.rating || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
              {(!recipes || recipes.length === 0) && (
                <p className="text-gray-500 text-center py-4">Aucune recette disponible</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Produits en vedette</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products && products.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center space-x-3">
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">{formatPrice(product.price || 0)}</p>
                  </div>
                  {product.promotion && (
                    <Badge variant="destructive" className="text-xs">
                      Promo
                    </Badge>
                  )}
                </div>
              ))}
              {(!products || products.length === 0) && (
                <p className="text-gray-500 text-center py-4">Aucun produit disponible</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vidéos récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {videos && videos.slice(0, 3).map((video) => (
                <div key={video.id} className="flex items-center space-x-3">
                  <div className="relative">
                    {video.thumbnail ? (
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Video className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                      <Video className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{video.title}</p>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{(video.views || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              {(!videos || videos.length === 0) && (
                <p className="text-gray-500 text-center py-4">Aucune vidéo disponible</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Video, 
  ChefHat, 
  TrendingUp,
  Calendar,
  DollarSign,
  Eye,
  Heart,
  Star,
  AlertCircle
} from 'lucide-react';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { useSupabaseRecipes } from '@/hooks/useSupabaseRecipes';
import { useSupabaseVideos } from '@/hooks/useSupabaseVideos';
import { useOrders } from '@/hooks/useOrders';
import { useSupabaseUsers } from '@/hooks/useSupabaseUsers';
import { formatCFA } from '@/lib/currency';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { data: products = [] } = useSupabaseProducts();
  const { data: recipes = [] } = useSupabaseRecipes();
  const { data: videos = [] } = useSupabaseVideos();
  const { data: orders = [] } = useOrders();
  const { data: users = [] } = useSupabaseUsers();

  // Calculs des statistiques
  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + (order.total_amount || 0), 0);

  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const inStockProducts = products.filter(product => product.in_stock).length;
  const outOfStockProducts = products.filter(product => !product.in_stock).length;

  const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
  const totalLikes = videos.reduce((sum, video) => sum + (video.likes || 0), 0);

  const statsCards = [
    {
      title: "Revenus totaux",
      value: formatCFA(totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+12%",
      changeColor: "text-green-600"
    },
    {
      title: "Commandes en attente",
      value: pendingOrders.toString(),
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: pendingOrders > 5 ? "Élevé" : "Normal",
      changeColor: pendingOrders > 5 ? "text-orange-600" : "text-green-600"
    },
    {
      title: "Utilisateurs actifs",
      value: users.length.toString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+8%",
      changeColor: "text-green-600"
    },
    {
      title: "Produits en stock",
      value: `${inStockProducts}/${products.length}`,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: outOfStockProducts > 0 ? `${outOfStockProducts} rupture` : "Tout OK",
      changeColor: outOfStockProducts > 0 ? "text-red-600" : "text-green-600"
    }
  ];

  const quickActions = [
    { title: "Gérer les produits", icon: Package, href: "/admin/produits", color: "bg-blue-500" },
    { title: "Nouvelle recette", icon: ChefHat, href: "/admin/recettes", color: "bg-green-500" },
    { title: "Commandes", icon: ShoppingCart, href: "/admin/commandes", color: "bg-orange-500" },
    { title: "Utilisateurs", icon: Users, href: "/admin/utilisateurs", color: "bg-purple-500" },
    { title: "Vidéos", icon: Video, href: "/admin/videos", color: "bg-red-500" },
    { title: "Équipe", icon: Users, href: "/admin/equipe", color: "bg-indigo-500" }
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">
            Aperçu de votre plateforme culinaire
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span className={`text-xs font-medium ${stat.changeColor}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all w-full"
                >
                  <div className={`p-2 rounded-full ${action.color} text-white`}>
                    <action.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-center leading-tight">
                    {action.title}
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Orders Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              Commandes récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">En attente</span>
                <Badge variant="secondary">{pendingOrders}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Livrées</span>
                <Badge className="bg-green-100 text-green-700">{deliveredOrders}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <Badge variant="outline">{orders.length}</Badge>
              </div>
            </div>
            <Link to="/admin/commandes">
              <Button variant="outline" size="sm" className="w-full mt-4">
                Voir toutes les commandes
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Content Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="h-5 w-5 text-red-500" />
              Contenu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Recettes</span>
                <Badge variant="secondary">{recipes.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Vidéos</span>
                <Badge variant="secondary">{videos.length}</Badge>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{totalViews.toLocaleString()} vues</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{totalLikes.toLocaleString()} likes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              Inventaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total produits</span>
                <Badge variant="secondary">{products.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">En stock</span>
                <Badge className="bg-green-100 text-green-700">{inStockProducts}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rupture</span>
                <Badge variant={outOfStockProducts > 0 ? "destructive" : "secondary"}>
                  {outOfStockProducts}
                </Badge>
              </div>
            </div>
            <Link to="/admin/produits">
              <Button variant="outline" size="sm" className="w-full mt-4">
                Gérer l'inventaire
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

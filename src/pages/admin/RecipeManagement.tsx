
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, Star, Clock, ChefHat } from 'lucide-react';
import RecipeForm from '@/components/admin/RecipeForm';
import { useSupabaseRecipes, useCreateSupabaseRecipe, useUpdateSupabaseRecipe, useDeleteSupabaseRecipe, Recipe } from '@/hooks/useSupabaseRecipes';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const RecipeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const { currentUser } = useAuth();
  
  const { data: recipes = [], isLoading, refetch } = useSupabaseRecipes();
  const createMutation = useCreateSupabaseRecipe();
  const updateMutation = useUpdateSupabaseRecipe();
  const deleteMutation = useDeleteSupabaseRecipe();

  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (data: Omit<Recipe, 'id' | 'created_at'>) => {
    if (!currentUser) return;
    
    await createMutation.mutateAsync({
      ...data,
      created_by: currentUser.id
    });
    setShowForm(false);
    refetch();
  };

  const handleUpdate = async (data: Omit<Recipe, 'id' | 'created_at'>) => {
    if (!editingRecipe) return;
    
    await updateMutation.mutateAsync({
      id: editingRecipe.id,
      ...data
    });
    setEditingRecipe(null);
    refetch();
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Supprimer la recette "${title}" ?`)) {
      await deleteMutation.mutateAsync(id);
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ChefHat className="h-8 w-8 mr-3 text-orange-500" />
            Recettes ({recipes.length})
          </h1>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle recette
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une recette..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img 
                src={recipe.image || '/placeholder.svg'} 
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-white/90">
                  {recipe.category}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.cook_time} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{recipe.rating || 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant={
                  recipe.difficulty === 'Facile' ? 'default' :
                  recipe.difficulty === 'Moyen' ? 'secondary' : 'destructive'
                }>
                  {recipe.difficulty || 'Non définie'}
                </Badge>
                
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setEditingRecipe(recipe)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(recipe.id, recipe.title)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ChefHat className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Aucune recette trouvée' : 'Aucune recette'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Commencez par créer votre première recette'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle recette</DialogTitle>
          </DialogHeader>
          <RecipeForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingRecipe} onOpenChange={() => setEditingRecipe(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la recette</DialogTitle>
          </DialogHeader>
          {editingRecipe && (
            <RecipeForm
              recipe={editingRecipe}
              onSubmit={handleUpdate}
              onCancel={() => setEditingRecipe(null)}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipeManagement;

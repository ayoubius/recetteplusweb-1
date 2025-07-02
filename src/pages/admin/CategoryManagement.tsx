
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { 
  useManageableProductCategories, 
  useManageableRecipeCategories,
  useCreateProductCategory,
  useUpdateProductCategory,
  useDeleteProductCategory,
  useCreateRecipeCategory,
  useUpdateRecipeCategory,
  useDeleteRecipeCategory,
  ManageableCategory
} from '@/hooks/useManageableCategories';
import CategoryFormDialog from '@/components/admin/CategoryFormDialog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

const CategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ManageableCategory | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState<ManageableCategory | null>(null);
  const [activeTab, setActiveTab] = useState('products');
  const { toast } = useToast();

  // Hooks for product categories
  const { data: productCategories = [], isLoading: isLoadingProducts } = useManageableProductCategories();
  const createProductCategory = useCreateProductCategory();
  const updateProductCategory = useUpdateProductCategory();
  const deleteProductCategoryMutation = useDeleteProductCategory();

  // Hooks for recipe categories
  const { data: recipeCategories = [], isLoading: isLoadingRecipes } = useManageableRecipeCategories();
  const createRecipeCategory = useCreateRecipeCategory();
  const updateRecipeCategory = useUpdateRecipeCategory();
  const deleteRecipeCategoryMutation = useDeleteRecipeCategory();

  const isLoading = isLoadingProducts || isLoadingRecipes;

  const getCurrentCategories = () => {
    return activeTab === 'products' ? productCategories : recipeCategories;
  };

  const filteredCategories = getCurrentCategories().filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = async (data: Omit<ManageableCategory, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (activeTab === 'products') {
        await createProductCategory.mutateAsync(data);
      } else {
        await createRecipeCategory.mutateAsync(data);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateCategory = async (data: Omit<ManageableCategory, 'id' | 'created_at' | 'updated_at'>) => {
    if (!selectedCategory) return;
    
    try {
      if (activeTab === 'products') {
        await updateProductCategory.mutateAsync({ id: selectedCategory.id, ...data });
      } else {
        await updateRecipeCategory.mutateAsync({ id: selectedCategory.id, ...data });
      }
      setIsFormOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;

    try {
      if (activeTab === 'products') {
        await deleteProductCategoryMutation.mutateAsync(deleteCategory.id);
      } else {
        await deleteRecipeCategoryMutation.mutateAsync(deleteCategory.id);
      }
      setDeleteCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEditCategory = (category: ManageableCategory) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleToggleActive = async (category: ManageableCategory) => {
    try {
      const updatedData = { ...category, is_active: !category.is_active };
      if (activeTab === 'products') {
        await updateProductCategory.mutateAsync({ id: category.id, is_active: !category.is_active });
      } else {
        await updateRecipeCategory.mutateAsync({ id: category.id, is_active: !category.is_active });
      }
      toast({
        title: category.is_active ? "Catégorie désactivée" : "Catégorie activée",
        description: `${category.name} a été ${category.is_active ? 'désactivée' : 'activée'} avec succès`
      });
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Catégories</h1>
          <p className="text-gray-600 mt-1">
            Gérez les catégories de produits et de recettes
          </p>
        </div>
        <Button 
          onClick={() => {
            setSelectedCategory(null);
            setIsFormOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">
            Catégories de Produits ({productCategories.length})
          </TabsTrigger>
          <TabsTrigger value="recipes">
            Catégories de Recettes ({recipeCategories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <CategoryGrid 
            categories={filteredCategories}
            isLoading={isLoading}
            onEdit={handleEditCategory}
            onDelete={setDeleteCategory}
            onToggleActive={handleToggleActive}
          />
        </TabsContent>

        <TabsContent value="recipes" className="space-y-4">
          <CategoryGrid 
            categories={filteredCategories}
            isLoading={isLoading}
            onEdit={handleEditCategory}
            onDelete={setDeleteCategory}
            onToggleActive={handleToggleActive}
          />
        </TabsContent>
      </Tabs>

      {/* Form Dialog */}
      <CategoryFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        category={selectedCategory}
        onSubmit={selectedCategory ? handleUpdateCategory : handleCreateCategory}
        isLoading={createProductCategory.isPending || updateProductCategory.isPending || 
                  createRecipeCategory.isPending || updateRecipeCategory.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la catégorie</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la catégorie "{deleteCategory?.name}" ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface CategoryGridProps {
  categories: ManageableCategory[];
  isLoading: boolean;
  onEdit: (category: ManageableCategory) => void;
  onDelete: (category: ManageableCategory) => void;
  onToggleActive: (category: ManageableCategory) => void;
}

const CategoryGrid = ({ categories, isLoading, onEdit, onDelete, onToggleActive }: CategoryGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune catégorie trouvée
          </h3>
          <p className="text-gray-600">
            Aucune catégorie ne correspond à votre recherche
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <Card key={category.id} className={cn(
          "transition-all duration-200 hover:shadow-md",
          !category.is_active && "opacity-60"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  {category.name}
                  {!category.is_active && (
                    <Badge variant="secondary" className="ml-2">Inactif</Badge>
                  )}
                </CardTitle>
                {category.description && (
                  <CardDescription className="mt-1">
                    {category.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Ordre: {category.display_order}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleActive(category)}
                  className="h-8 w-8 p-0"
                >
                  {category.is_active ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(category)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CategoryManagement;

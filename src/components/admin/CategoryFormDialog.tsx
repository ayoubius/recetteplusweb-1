
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { ManageableCategory } from '@/hooks/useManageableCategories';

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: ManageableCategory | null;
  onSubmit: (data: Omit<ManageableCategory, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  isLoading: boolean;
}

type FormData = {
  name: string;
  description: string;
  is_active: boolean;
  display_order: number;
};

const CategoryFormDialog = ({ 
  open, 
  onOpenChange, 
  category, 
  onSubmit, 
  isLoading 
}: CategoryFormDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
      display_order: 0
    }
  });

  const isActive = watch('is_active');

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || '',
        is_active: category.is_active,
        display_order: category.display_order
      });
    } else {
      reset({
        name: '',
        description: '',
        is_active: true,
        display_order: 0
      });
    }
  }, [category, reset]);

  const onFormSubmit = async (data: FormData) => {
    await onSubmit({
      name: data.name,
      description: data.description || null,
      is_active: data.is_active,
      display_order: data.display_order
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la catégorie *</Label>
            <Input
              id="name"
              {...register('name', { 
                required: 'Le nom est requis',
                minLength: {
                  value: 2,
                  message: 'Le nom doit contenir au moins 2 caractères'
                }
              })}
              placeholder="Ex: Légumes frais"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Description de la catégorie (optionnel)"
              rows={3}
            />
          </div>

          {/* Display Order */}
          <div className="space-y-2">
            <Label htmlFor="display_order">Ordre d'affichage</Label>
            <Input
              id="display_order"
              type="number"
              min="0"
              {...register('display_order', {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "L'ordre doit être un nombre positif"
                }
              })}
              placeholder="0"
              className={errors.display_order ? 'border-red-500' : ''}
            />
            {errors.display_order && (
              <p className="text-sm text-red-500">{errors.display_order.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Plus le nombre est petit, plus la catégorie apparaîtra en premier
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="is_active">Catégorie active</Label>
              <p className="text-xs text-gray-500">
                Les catégories inactives ne sont pas visibles publiquement
              </p>
            </div>
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Enregistrement...</span>
                </div>
              ) : (
                category ? 'Modifier' : 'Créer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;

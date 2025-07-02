
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { recipeService, Recipe } from '@/lib/firestore';

export const useRecipes = () => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: recipeService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipeService.getById(id),
    enabled: !!id,
  });
};


export const formatCFA = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Fonction principale pour formater les prix en FCFA
export const formatPrice = (amount: number): string => {
  return formatCFA(amount);
};

export const DELIVERY_FEE = 1000; // Prix de livraison en FCFA

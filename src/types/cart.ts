
// Types for the unified cart system
export interface MainCartItem {
  user_id: string;
  cart_type: 'personal' | 'recipe' | 'preconfigured';
  cart_id: string;
  cart_name: string;
  item_id: string;
  product_id: string | null;
  quantity: number;
  product_name: string;
  unit_price: number;
  total_price: number;
}

export interface CartSummary {
  subtotal: number;
  itemsCount: number;
  deliveryFee: number;
  total: number;
}

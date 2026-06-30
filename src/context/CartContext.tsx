import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, ProductVariant, CartItem } from '../lib/supabase';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant: ProductVariant) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, variant: ProductVariant) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.variant.id === variant.id);
      if (existing) return prev;
      return [...prev, { product, variant }];
    });
  };

  const removeFromCart = (variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variant.id !== variantId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.variant.price_jod, 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

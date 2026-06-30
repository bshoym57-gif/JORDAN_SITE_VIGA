import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  label_ar: string;
  label_en: string;
  quantity: number;
  price_jod: number;
  original_price_jod: number | null;
  is_popular: boolean;
  sort_order: number;
};

export type Product = {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  price_jod: number;
  category_id: string | null;
  image_url: string | null;
  stock_quantity: number;
  is_featured: boolean;
  sort_order: number;
  slug: string | null;
  product_variants?: ProductVariant[];
  product_images?: ProductImage[];
};

export type CartItem = {
  product: Product;
  variant: ProductVariant;
};

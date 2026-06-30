-- Create categories table for men's products
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  price_jod DECIMAL(10, 2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  total_jod DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_jod DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for categories (public read)
CREATE POLICY "categories_select" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- RLS policies for products (public read)
CREATE POLICY "products_select" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- RLS policies for orders (public insert, read own)
CREATE POLICY "orders_insert" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "orders_select" ON orders FOR SELECT
  TO anon, authenticated USING (true);

-- RLS policies for order_items (public insert via orders)
CREATE POLICY "order_items_insert" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "order_items_select" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

-- Insert sample categories
INSERT INTO categories (name_ar, name_en, slug, icon, sort_order) VALUES
('ملابس رسمية', 'Formal Wear', 'formal-wear', 'shirt', 1),
('ملابس كاجوال', 'Casual Wear', 'casual-wear', 'tshirt', 2),
('أحذية', 'Shoes', 'shoes', 'footprints', 3),
('ساعات', 'Watches', 'watches', 'watch', 4),
('إكسسوارات', 'Accessories', 'accessories', 'gem', 5),
('عناية شخصية', 'Grooming', 'grooming', 'sparkles', 6),
('حقائب', 'Bags', 'bags', 'briefcase', 7);

-- Insert sample products
INSERT INTO products (name_ar, name_en, description_ar, description_en, price_jod, category_id, image_url, stock_quantity, is_featured, sort_order) VALUES
('بدلة رسمية كلاسيكية', 'Classic Formal Suit', 'بدلة أنيقة مثالية للمناسبات الرسمية والاجتماعات العملية', 'Elegant suit perfect for formal occasions and business meetings', 149.99, (SELECT id FROM categories WHERE slug = 'formal-wear'), 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600', 25, true, 1),
('قميص أبيض أنيق', 'Elegant White Shirt', 'قميص أبيض كلاسيكي من القطن عالي الجودة', 'Classic white shirt made from high-quality cotton', 29.99, (SELECT id FROM categories WHERE slug = 'formal-wear'), 'https://images.pexels.com/photos/1599785/pexels-photo-1599785.jpeg?auto=compress&cs=tinysrgb&w=600', 50, true, 2),
('بنطلون جينز عصري', 'Modern Jeans', 'بنطلون جينز مريح بتصميم عصري مناسب لجميع المناسبات', 'Comfortable jeans with modern design suitable for all occasions', 45.99, (SELECT id FROM categories WHERE slug = 'casual-wear'), 'https://images.pexels.com/photos/1599785/pexels-photo-1599785.jpeg?auto=compress&cs=tinysrgb&w=600', 40, false, 3),
('تيشيرت قطن أسود', 'Black Cotton T-Shirt', 'تيشيرت أسود بسيط وأنيق من القطن 100%', 'Simple and elegant black t-shirt made from 100% cotton', 19.99, (SELECT id FROM categories WHERE slug = 'casual-wear'), 'https://images.pexels.com/photos/1655506/pexels-photo-1655506.jpeg?auto=compress&cs=tinysrgb&w=600', 60, false, 4),
('حذاء جلدي كلاسيكي', 'Classic Leather Shoes', 'حذاء رسمي من الجلد الطبيعي بتصميم عصري ومريح', 'Formal shoes made from genuine leather with modern comfortable design', 79.99, (SELECT id FROM categories WHERE slug = 'shoes'), 'https://images.pexels.com/photos/263208/pexels-photo-263208.jpeg?auto=compress&cs=tinysrgb&w=600', 30, true, 5),
('حذاء رياضي أبيض', 'White Sneakers', 'حذاء رياضي أبيض أنيق مناسب للإطلالات الكاجوال', 'Elegant white sneakers suitable for casual outfits', 54.99, (SELECT id FROM categories WHERE slug = 'shoes'), 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600', 35, false, 6),
('ساعة يد فاخرة', 'Luxury Wristwatch', 'ساعة أنيقة بتصميم فاخر مناسب للرجال العصريين', 'Elegant watch with luxury design suitable for modern men', 199.99, (SELECT id FROM categories WHERE slug = 'watches'), 'https://images.pexels.com/photos/2735677/pexels-photo-2735677.jpeg?auto=compress&cs=tinysrgb&w=600', 20, true, 7),
('حزام جلدي بني', 'Brown Leather Belt', 'حزام من الجلد الطبيعي باللون البني', 'Belt made from genuine leather in brown color', 34.99, (SELECT id FROM categories WHERE slug = 'accessories'), 'https://images.pexels.com/photos/914668/pexels-photo-914668.jpeg?auto=compress&cs=tinysrgb&w=600', 45, false, 8),
('نظارة شمسية أنيقة', 'Elegant Sunglasses', 'نظارة شمسية بتصميم عصري يحمي من الأشعة الضارة', 'Sunglasses with modern design that protects from harmful rays', 59.99, (SELECT id FROM categories WHERE slug = 'accessories'), 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600', 25, true, 9),
('عطر رجالي فاخر', 'Luxury Men''s Perfume', 'عطر رجالي أنيق برائحة مميزة تدوم طويلاً', 'Elegant men''s perfume with distinctive long-lasting scent', 89.99, (SELECT id FROM categories WHERE slug = 'grooming'), 'https://images.pexels.com/photos/3218096/pexels-photo-3218096.jpeg?auto=compress&cs=tinysrgb&w=600', 30, false, 10),
('شورت كاجوال', 'Casual Shorts', 'شورت مريح للصيف بتصميم عصري', 'Comfortable summer shorts with modern design', 24.99, (SELECT id FROM categories WHERE slug = 'casual-wear'), 'https://images.pexels.com/photos/1599785/pexels-photo-1599785.jpeg?auto=compress&cs=tinysrgb&w=600', 45, false, 11),
('حقيبة يد جلدية', 'Leather Handbag', 'حقيبة يد أنيقة من الجلد الطبيعي مناسبة للعمل', 'Elegant handbag made from genuine leather suitable for work', 69.99, (SELECT id FROM categories WHERE slug = 'bags'), 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600', 20, false, 12);

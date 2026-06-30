-- Create product_variants table for package options
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  label_ar TEXT NOT NULL,
  label_en TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price_jod DECIMAL(10, 2) NOT NULL,
  original_price_jod DECIMAL(10, 2),
  is_popular BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "variants_select" ON product_variants FOR SELECT
  TO anon, authenticated USING (true);

-- Clear old products and insert new one
DELETE FROM products;

-- Insert ETUMAX Royal Honey product
INSERT INTO products (name_ar, name_en, description_ar, description_en, price_jod, image_url, stock_quantity, is_featured, sort_order) 
VALUES (
  'العسل الملكي للرجال ETUMAX',
  'ETUMAX Royal Honey for Men',
  'العسل الملكي الأصلي المزود بغذاء الملكات وحبوب اللقاح وأعشاب المطر الاستوائية - لتعزيز الطاقة والحيوية',
  'Original Royal Honey enriched with Royal Jelly, Bee Pollen & Rainforest Herbs - for enhanced energy and vitality',
  10.00,
  '/images/products/ETUMAX-Royal-Honey-for-men-4.jpg',
  500,
  true,
  1
);

-- Insert the 3 package variants
INSERT INTO product_variants (product_id, label_ar, label_en, quantity, price_jod, original_price_jod, is_popular, sort_order)
VALUES
(
  (SELECT id FROM products WHERE name_en = 'ETUMAX Royal Honey for Men'),
  'علبة واحدة',
  '1 Box',
  1,
  10.00,
  12.00,
  false,
  1
),
(
  (SELECT id FROM products WHERE name_en = 'ETUMAX Royal Honey for Men'),
  'علبتان',
  '2 Boxes',
  2,
  13.00,
  20.00,
  true,
  2
),
(
  (SELECT id FROM products WHERE name_en = 'ETUMAX Royal Honey for Men'),
  'أربع علب',
  '4 Boxes',
  4,
  25.00,
  40.00,
  false,
  3
);

-- Update order_items to store variant info
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS variant_label TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS variant_quantity INTEGER DEFAULT 1;

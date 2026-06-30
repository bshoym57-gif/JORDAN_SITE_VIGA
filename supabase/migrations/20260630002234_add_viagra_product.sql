-- Add the second product: Viagra American
INSERT INTO products (name_ar, name_en, description_ar, description_en, price_jod, image_url, stock_quantity, is_featured, sort_order)
VALUES (
  'فياجرا الأمريكية الأصلية',
  'American Viagra Original',
  '30 حبة أصلية مختومة 100% - من Pfizer Labs - مجربة ومكفولة ومضمونة للأداء العالي والثقة',
  '30 Original Sealed Tablets 100% Authentic - By Pfizer Labs - Proven, guaranteed for high performance',
  15.00,
  '/images/products/صورة_الريلز_للفياجرا.png',
  200,
  true,
  2
);

-- Insert variants for Viagra product
INSERT INTO product_variants (product_id, label_ar, label_en, quantity, price_jod, original_price_jod, is_popular, sort_order)
VALUES
(
  (SELECT id FROM products WHERE name_en = 'American Viagra Original'),
  'علبة واحدة',
  '1 Box (30 tablets)',
  30,
  15.00,
  20.00,
  false,
  1
),
(
  (SELECT id FROM products WHERE name_en = 'American Viagra Original'),
  'علبتان',
  '2 Boxes (60 tablets)',
  60,
  25.00,
  40.00,
  true,
  2
),
(
  (SELECT id FROM products WHERE name_en = 'American Viagra Original'),
  'ثلاث علب',
  '3 Boxes (90 tablets)',
  90,
  35.00,
  60.00,
  false,
  3
);

-- Add slug column to products for URL routing
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;

-- Update slugs
UPDATE products SET slug = 'عسل-ملكي-etumax' WHERE name_en = 'ETUMAX Royal Honey for Men';
UPDATE products SET slug = 'فياجرا-امريكية' WHERE name_en = 'American Viagra Original';

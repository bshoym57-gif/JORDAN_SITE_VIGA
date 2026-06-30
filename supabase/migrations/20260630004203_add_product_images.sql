-- Create product_images table
CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_images_select" ON product_images FOR SELECT
  TO anon, authenticated USING (true);

-- Insert ETUMAX honey images
INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, '/images/products/ETUMAX-Royal-Honey-for-men-4.jpg', 1
FROM products WHERE name_en = 'ETUMAX Royal Honey for Men';

INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, '/images/products/original-etumax-royal-honey_(2).webp', 2
FROM products WHERE name_en = 'ETUMAX Royal Honey for Men';

INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, '/images/products/original-etumax-royal-honey_(1).webp', 3
FROM products WHERE name_en = 'ETUMAX Royal Honey for Men';

-- Insert Viagra images
INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, '/images/products/صورة_الريلز_للفياجرا.png', 1
FROM products WHERE name_en = 'American Viagra Original';

INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, '/images/products/viagrabylatiov9-300x285.jpg', 2
FROM products WHERE name_en = 'American Viagra Original';

INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, '/images/products/f27af77e-adf2-4747-ae95-d36bd526f077-500x400.jpg', 3
FROM products WHERE name_en = 'American Viagra Original';

-- Update honey description to mention 12 sachets
UPDATE products
SET
  description_ar = 'عبوة 12 ظرف أصلية مختومة - العسل الملكي الأصلي المزود بغذاء الملكات وحبوب اللقاح وأعشاب المطر الاستوائية لتعزيز الطاقة والحيوية',
  description_en = '12 Sachets per box - Original Royal Honey enriched with Royal Jelly, Bee Pollen & Rainforest Herbs'
WHERE name_en = 'ETUMAX Royal Honey for Men';

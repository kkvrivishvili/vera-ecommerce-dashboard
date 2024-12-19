-- VERA E-COMMERCE DATABASE INITIALIZATION SCRIPT
-- Este script debe ejecutarse en Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up existing tables if needed (be careful with this in production)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'customer');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'transfer', 'cash');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE meal_tag AS ENUM ('new-arrival', 'featured', 'seasonal', 'bestseller', 'promotion', 'popular');
CREATE TYPE side_dish AS ENUM ('roasted-vegetables', 'mashed-potatoes', 'quinoa', 'rice');

-- USER PROFILES
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'customer',
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- CATEGORIES
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    color VARCHAR(50),
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCT TAGS
CREATE TABLE product_tags (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    tag meal_tag NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, tag)
);

-- PRODUCT DETAILS
CREATE TABLE product_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    nutritional_info JSONB DEFAULT '{
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "fat": 0,
        "fiber": 0
    }',
    preparation_info JSONB DEFAULT '{
        "heatingTime": 0,
        "servingSize": "",
        "servings": 1,
        "sideDish": null
    }',
    storage_info JSONB DEFAULT '{
        "shelfLife": 0,
        "instructions": ""
    }',
    dietary_info JSONB DEFAULT '{
        "isGlutenFree": false,
        "isDairyFree": false,
        "isSoyFree": false,
        "isNutFree": false,
        "isVegan": false
    }',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id)
);

-- ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    payment_method payment_method,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ORDER ITEMS
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- CART ITEMS
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- REVIEWS
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status review_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- WISHLISTS
CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- WISHLIST ITEMS
CREATE TABLE wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(wishlist_id, product_id)
);

-- SETTINGS
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Disable Row Level Security for public access
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists DISABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Grant public access to tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update product rating and review count
CREATE OR REPLACE FUNCTION update_product_metrics()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET rating = (
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM reviews
        WHERE product_id = NEW.product_id
        AND status = 'approved'
    ),
    reviews_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE product_id = NEW.product_id
        AND status = 'approved'
    )
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_details_updated_at
    BEFORE UPDATE ON product_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wishlists_updated_at
    BEFORE UPDATE ON wishlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_metrics
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_metrics();

-- Create and configure Storage bucket for product images
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'products'
    ) THEN
        INSERT INTO storage.buckets (id, name, public) 
        VALUES ('products', 'products', true);
    END IF;
END $$;

-- Allow public access to the products bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'products');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'products');

-- Insert categories
INSERT INTO categories (id, name, slug, description, color, icon, is_active, display_order) VALUES
  (gen_random_uuid(), 'Alto en Proteína', 'protein', 'Platos ricos en proteína para tu desarrollo muscular', 'bg-red-500', 'dumbbell', true, 1),
  (gen_random_uuid(), 'Vegetariano', 'vegetarian', 'Deliciosas opciones vegetarianas', 'bg-green-500', 'leaf', true, 2),
  (gen_random_uuid(), 'Vegano', 'vegan', '100% libre de productos animales', 'bg-emerald-500', 'sprout', true, 3),
  (gen_random_uuid(), 'Bajo en Carbohidratos', 'lowCarb', 'Ideal para dietas bajas en carbohidratos', 'bg-purple-500', 'wheat-off', true, 4);

-- Insert products
INSERT INTO products (id, title, description, image_url, price, category_id, is_active, stock_quantity, rating, reviews_count) VALUES
  -- Proteína
  (gen_random_uuid(), 'Pollo al Limón con Quinoa', 'Pechuga de pollo jugosa marinada en limón, acompañada de quinoa y vegetales al vapor', '/temporary/p1.png', 5500, (SELECT id FROM categories WHERE slug = 'protein'), true, 15, 4.8, 256),
  (gen_random_uuid(), 'Salmón Teriyaki con Arroz Integral', 'Filete de salmón glaseado con salsa teriyaki casera y arroz integral con vegetales', '/temporary/p3.png', 7899, (SELECT id FROM categories WHERE slug = 'protein'), true, 12, 4.9, 124),
  (gen_random_uuid(), 'Atún a la Plancha con Quinoa', 'Filete de atún fresco a la plancha con ensalada de quinoa y vegetales asados', '/temporary/p7.png', 3799, (SELECT id FROM categories WHERE slug = 'protein'), true, 8, 4.7, 98),
  (gen_random_uuid(), 'Bowl de Huevo y Aguacate', 'Bowl proteico con huevos pochados, aguacate, espinacas y pan integral', '/temporary/p8.png', 2199, (SELECT id FROM categories WHERE slug = 'protein'), true, 20, 4.6, 167),

  -- Bajo en Carbohidratos
  (gen_random_uuid(), 'Pavo al Romero con Puré de Coliflor', 'Pechuga de pavo marinada con romero y puré cremoso de coliflor bajo en carbohidratos', '/temporary/p5.png', 2599, (SELECT id FROM categories WHERE slug = 'lowCarb'), true, 18, 4.5, 78),
  (gen_random_uuid(), 'Ensalada Keto de Pollo', 'Ensalada keto con pollo, aguacate, huevo y aderezo ranch casero', '/temporary/p9.png', 4399, (SELECT id FROM categories WHERE slug = 'lowCarb'), true, 15, 4.4, 92),
  (gen_random_uuid(), 'Bowl Mediterráneo Low-Carb', 'Bowl mediterráneo con atún, aceitunas, pepino y humus de aguacate', '/temporary/p10.png', 1699, (SELECT id FROM categories WHERE slug = 'lowCarb'), true, 10, 4.6, 85),
  (gen_random_uuid(), 'Pollo a la Parrilla Keto', 'Pollo a la parrilla con vegetales asados y salsa de mantequilla con hierbas', '/temporary/p11.png', 499, (SELECT id FROM categories WHERE slug = 'lowCarb'), true, 12, 4.7, 103),

  -- Vegano
  (gen_random_uuid(), 'Bowl Vegano de Quinoa y Garbanzos', 'Bowl proteico vegano con quinoa, garbanzos especiados, aguacate y vegetales asados', '/temporary/p4.png', 2399, (SELECT id FROM categories WHERE slug = 'vegan'), true, 5, 4.7, 92),
  (gen_random_uuid(), 'Curry de Garbanzos y Espinacas', 'Curry aromático de garbanzos con espinacas y arroz basmati integral', '/temporary/p12.png', 2199, (SELECT id FROM categories WHERE slug = 'vegan'), true, 14, 4.5, 76),
  (gen_random_uuid(), 'Buddha Bowl Vegano', 'Bowl vegano con tempeh marinado, quinoa, vegetales asados y salsa tahini', '/temporary/p13.png', 2599, (SELECT id FROM categories WHERE slug = 'vegan'), true, 8, 4.8, 112),
  (gen_random_uuid(), 'Pasta de Lentejas con Champiñones', 'Pasta de lentejas con salsa de champiñones y espinacas', '/temporary/p14.png', 6299, (SELECT id FROM categories WHERE slug = 'vegan'), true, 16, 4.6, 89),

  -- Vegetariano
  (gen_random_uuid(), 'Bowl Vegetariano de Lentejas', 'Bowl nutritivo de lentejas, arroz integral, vegetales asados y hummus casero', '/temporary/p2.png', 2299, (SELECT id FROM categories WHERE slug = 'vegetarian'), true, 8, 4.6, 89),
  (gen_random_uuid(), 'Curry Vegetariano de Garbanzos', 'Curry aromático de garbanzos con espinacas y arroz basmati integral', '/temporary/p6.png', 2199, (SELECT id FROM categories WHERE slug = 'vegetarian'), true, 10, 4.4, 65),
  (gen_random_uuid(), 'Lasaña de Vegetales', 'Lasaña de berenjena y calabacín con ricotta y salsa de tomate casera', '/temporary/p15.png', 2499, (SELECT id FROM categories WHERE slug = 'vegetarian'), true, 6, 4.7, 94),
  (gen_random_uuid(), 'Risotto de Hongos', 'Risotto cremoso de hongos silvestres con queso parmesano y espárragos', '/temporary/p16.png', 2699, (SELECT id FROM categories WHERE slug = 'vegetarian'), true, 9, 4.8, 108);

-- Insert product details for each product
INSERT INTO product_details (product_id, nutritional_info, preparation_info, storage_info, dietary_info)
SELECT 
  p.id as product_id,
  CASE 
    WHEN c.slug = 'protein' THEN
      jsonb_build_object(
        'calories', floor(random() * (600-400) + 400),
        'protein', floor(random() * (40-25) + 25),
        'carbs', floor(random() * (30-15) + 15),
        'fat', floor(random() * (25-10) + 10),
        'fiber', floor(random() * (8-3) + 3)
      )
    WHEN c.slug = 'lowCarb' THEN
      jsonb_build_object(
        'calories', floor(random() * (500-300) + 300),
        'protein', floor(random() * (35-20) + 20),
        'carbs', floor(random() * (15-5) + 5),
        'fat', floor(random() * (35-20) + 20),
        'fiber', floor(random() * (10-5) + 5)
      )
    WHEN c.slug = 'vegan' THEN
      jsonb_build_object(
        'calories', floor(random() * (550-350) + 350),
        'protein', floor(random() * (25-15) + 15),
        'carbs', floor(random() * (60-40) + 40),
        'fat', floor(random() * (20-10) + 10),
        'fiber', floor(random() * (15-8) + 8)
      )
    ELSE
      jsonb_build_object(
        'calories', floor(random() * (600-400) + 400),
        'protein', floor(random() * (25-15) + 15),
        'carbs', floor(random() * (50-30) + 30),
        'fat', floor(random() * (25-15) + 15),
        'fiber', floor(random() * (12-6) + 6)
      )
  END,
  jsonb_build_object(
    'heatingTime', floor(random() * (5-2) + 2),
    'servingSize', '350g',
    'servings', 1,
    'sideDish', CASE 
      WHEN random() < 0.25 THEN 'roasted-vegetables'
      WHEN random() < 0.5 THEN 'quinoa'
      WHEN random() < 0.75 THEN 'rice'
      ELSE 'mashed-potatoes'
    END
  ),
  jsonb_build_object(
    'shelfLife', floor(random() * (7-3) + 3),
    'instructions', 'Mantener refrigerado entre 0°C y 5°C'
  ),
  CASE 
    WHEN c.slug = 'protein' THEN
      jsonb_build_object(
        'isGlutenFree', true,
        'isDairyFree', random() < 0.7,
        'isSoyFree', true,
        'isNutFree', true,
        'isVegan', false
      )
    WHEN c.slug = 'lowCarb' THEN
      jsonb_build_object(
        'isGlutenFree', true,
        'isDairyFree', random() < 0.5,
        'isSoyFree', true,
        'isNutFree', random() < 0.8,
        'isVegan', false
      )
    WHEN c.slug = 'vegan' THEN
      jsonb_build_object(
        'isGlutenFree', random() < 0.8,
        'isDairyFree', true,
        'isSoyFree', random() < 0.6,
        'isNutFree', random() < 0.7,
        'isVegan', true
      )
    ELSE
      jsonb_build_object(
        'isGlutenFree', random() < 0.7,
        'isDairyFree', random() < 0.5,
        'isSoyFree', random() < 0.8,
        'isNutFree', random() < 0.6,
        'isVegan', false
      )
  END
FROM products p
JOIN categories c ON p.category_id = c.id;

-- Initial Settings
INSERT INTO settings (key, value, type, description) VALUES
('site_name', '"Vera E-commerce"', 'string', 'Nombre del sitio'),
('currency', '"USD"', 'string', 'Moneda predeterminada'),
('tax_rate', '0.21', 'number', 'Tasa de impuesto predeterminada'),
('shipping_cost', '999', 'number', 'Costo de envío base'),
('free_shipping_threshold', '14999', 'number', 'Monto mínimo para envío gratis'),
('min_order_amount', '4999', 'number', 'Monto mínimo de pedido');

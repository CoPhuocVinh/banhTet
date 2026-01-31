-- ============================================
-- COMPLETE SETUP - Run this once in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. Add missing column: order_code
-- ============================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_code VARCHAR(20) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_orders_order_code ON orders(order_code);

-- ============================================
-- 2. Drop existing policies (to avoid conflicts)
-- ============================================
DROP POLICY IF EXISTS "Public read orders" ON orders;
DROP POLICY IF EXISTS "Public read order_items" ON order_items;
DROP POLICY IF EXISTS "Public update orders" ON orders;
DROP POLICY IF EXISTS "Public update order_items" ON order_items;
DROP POLICY IF EXISTS "Public delete orders" ON orders;
DROP POLICY IF EXISTS "Public delete order_items" ON order_items;

-- ============================================
-- 3. RLS Policies for Orders (Admin needs full access)
-- ============================================

-- Allow reading orders (for admin dashboard)
CREATE POLICY "Public read orders" ON orders
  FOR SELECT USING (true);

-- Allow updating orders (for admin to change status)
CREATE POLICY "Public update orders" ON orders
  FOR UPDATE USING (true);

-- Allow deleting orders (for admin)
CREATE POLICY "Public delete orders" ON orders
  FOR DELETE USING (true);

-- ============================================
-- 4. RLS Policies for Order Items
-- ============================================

-- Allow reading order items
CREATE POLICY "Public read order_items" ON order_items
  FOR SELECT USING (true);

-- Allow updating order items
CREATE POLICY "Public update order_items" ON order_items
  FOR UPDATE USING (true);

-- Allow deleting order items
CREATE POLICY "Public delete order_items" ON order_items
  FOR DELETE USING (true);

-- ============================================
-- 5. RLS Policies for Site Settings (Admin can edit)
-- ============================================
DROP POLICY IF EXISTS "Public update site_settings" ON site_settings;
DROP POLICY IF EXISTS "Public insert site_settings" ON site_settings;
DROP POLICY IF EXISTS "Public delete site_settings" ON site_settings;

CREATE POLICY "Public update site_settings" ON site_settings
  FOR UPDATE USING (true);

CREATE POLICY "Public insert site_settings" ON site_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public delete site_settings" ON site_settings
  FOR DELETE USING (true);

-- ============================================
-- 6. RLS Policies for Products (Admin can edit)
-- ============================================
DROP POLICY IF EXISTS "Public update products" ON products;
DROP POLICY IF EXISTS "Public insert products" ON products;
DROP POLICY IF EXISTS "Public delete products" ON products;

CREATE POLICY "Public update products" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Public insert products" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public delete products" ON products
  FOR DELETE USING (true);

-- ============================================
-- 7. RLS Policies for Price Tiers (Admin can edit)
-- ============================================
DROP POLICY IF EXISTS "Public update price_tiers" ON price_tiers;
DROP POLICY IF EXISTS "Public insert price_tiers" ON price_tiers;
DROP POLICY IF EXISTS "Public delete price_tiers" ON price_tiers;

CREATE POLICY "Public update price_tiers" ON price_tiers
  FOR UPDATE USING (true);

CREATE POLICY "Public insert price_tiers" ON price_tiers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public delete price_tiers" ON price_tiers
  FOR DELETE USING (true);

-- ============================================
-- 8. RLS Policies for Product Tier Prices (Admin can edit)
-- ============================================
DROP POLICY IF EXISTS "Public update product_tier_prices" ON product_tier_prices;
DROP POLICY IF EXISTS "Public insert product_tier_prices" ON product_tier_prices;
DROP POLICY IF EXISTS "Public delete product_tier_prices" ON product_tier_prices;

CREATE POLICY "Public update product_tier_prices" ON product_tier_prices
  FOR UPDATE USING (true);

CREATE POLICY "Public insert product_tier_prices" ON product_tier_prices
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public delete product_tier_prices" ON product_tier_prices
  FOR DELETE USING (true);

-- ============================================
-- 9. RLS Policies for Date Tier Assignments (Admin can edit)
-- ============================================
DROP POLICY IF EXISTS "Public update date_tier_assignments" ON date_tier_assignments;
DROP POLICY IF EXISTS "Public insert date_tier_assignments" ON date_tier_assignments;
DROP POLICY IF EXISTS "Public delete date_tier_assignments" ON date_tier_assignments;

CREATE POLICY "Public update date_tier_assignments" ON date_tier_assignments
  FOR UPDATE USING (true);

CREATE POLICY "Public insert date_tier_assignments" ON date_tier_assignments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public delete date_tier_assignments" ON date_tier_assignments
  FOR DELETE USING (true);

-- ============================================
-- 10. RLS Policies for Order Statuses (Admin can edit)
-- ============================================
DROP POLICY IF EXISTS "Public update order_statuses" ON order_statuses;
DROP POLICY IF EXISTS "Public insert order_statuses" ON order_statuses;
DROP POLICY IF EXISTS "Public delete order_statuses" ON order_statuses;

CREATE POLICY "Public update order_statuses" ON order_statuses
  FOR UPDATE USING (true);

CREATE POLICY "Public insert order_statuses" ON order_statuses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public delete order_statuses" ON order_statuses
  FOR DELETE USING (true);

-- ============================================
-- Done! All policies have been set up.
-- ============================================
SELECT 'All RLS policies have been configured!' as message;

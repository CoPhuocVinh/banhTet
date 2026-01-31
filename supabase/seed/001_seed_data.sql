-- Bánh Tét Tết - Seed Data
-- Run this after the initial schema migration

-- ============================================
-- Price Tiers (3 tiers)
-- ============================================
INSERT INTO price_tiers (id, name, description, color) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Ngày thường', 'Giá ngày thường', '#22C55E'),
  ('00000000-0000-0000-0000-000000000002', 'Ngày cao điểm', 'Giá ngày cao điểm (25-28 Tết)', '#F59E0B'),
  ('00000000-0000-0000-0000-000000000003', 'Ngày Tết', 'Giá ngày Tết (29-30 và mùng 1-3)', '#EF4444')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Order Statuses
-- ============================================
INSERT INTO order_statuses (id, name, color, display_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Chờ xác nhận', '#F59E0B', 1),
  ('10000000-0000-0000-0000-000000000002', 'Đã xác nhận', '#3B82F6', 2),
  ('10000000-0000-0000-0000-000000000003', 'Đang chuẩn bị', '#8B5CF6', 3),
  ('10000000-0000-0000-0000-000000000004', 'Đang giao', '#06B6D4', 4),
  ('10000000-0000-0000-0000-000000000005', 'Hoàn thành', '#22C55E', 5),
  ('10000000-0000-0000-0000-000000000006', 'Đã hủy', '#EF4444', 6)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Products (8 sản phẩm)
-- ============================================
INSERT INTO products (id, name, slug, description, weight_grams, is_available, display_order) VALUES

  (
    '20000000-0000-0000-0000-000000000002',
    'Nhân đậu + thịt + trứng muối + 3 màu',
    'tet-3-mau',
    'Bánh tét nhân đậu + thịt + trứng muối + 3 màu.',
    1200,
    true,
    2
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    'Nhân đậu + thịt + trứng muối - Loại lớn',
    'tet-thit-trung-lon',
    'Bánh tét nhân đậu + thịt + trứng muối - Loại lớn.',
    1200,
    true,
    3
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    'Nhân đậu + thịt + trứng muối - Loại nhỏ',
    'tet-thit-trung-nho',
    'Bánh tét nhân đậu + thịt + trứng muối - Loại nhỏ.',
    1000,
    true,
    4
  ),
  (
    '20000000-0000-0000-0000-000000000005',
    'Nhân đậu mỡ và chay đậu xanh',
    'tet-dau-mo-chay',
    'Bánh tét nhân đậu mỡ và chay đậu xanh.',
    1000,
    true,
    5
  ),
  (
    '20000000-0000-0000-0000-000000000006',
    'Nhân chuối',
    'tet-chuoi',
    'Bánh tét nhân chuối.',
    800,
    true,
    6
  ),
  (
    '20000000-0000-0000-0000-000000000007',
    'Bánh ú nhân đậu + thịt + trứng muối + tôm khô',
    'u-thap-cam-tom-kho',
    'Bánh ú nhân đậu + thịt + trứng muối + tôm khô.',
    900,
    true,
    7
  ),
  (
    '20000000-0000-0000-0000-000000000008',
    'Bánh ú nhân đậu + thịt + trứng muối',
    'u-thap-cam',
    'Bánh ú nhân đậu + thịt + trứng muối.',
    500,
    true,
    8
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Product Tier Prices
-- ============================================

-- Tét - 3 màu (1.2kg)
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 150000),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 160000),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 165000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Tét - Thịt trứng (Lớn - 1.2kg)
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 140000),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 150000),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 160000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Tét - Thịt trứng (Nhỏ - 1.0kg)
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 120000),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 130000),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 140000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Tét - Đậu mỡ & Chay (1.0kg)
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 100000),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 120000),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 130000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Tét - Chuối (800g)
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 80000),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 90000),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 100000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Ú - Thập cẩm Tôm Khô (900g)
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 130000),
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 140000),
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 145000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Ú - Thập cẩm (500g)
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 75000),
  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', 80000),
  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', 85000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- ============================================
-- Site Settings
-- ============================================
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'Bánh Tét Tết'),
  ('site_description', 'Đặt bánh tét Tết chất lượng cao, giao hàng tận nơi'),
  ('contact_phone', '0901234567'),
  ('contact_email', 'contact@banhtet.vn'),
  ('contact_address', 'TP. Hồ Chí Minh, Việt Nam'),
  ('facebook_url', 'https://facebook.com/banhtettet'),
  ('zalo_url', 'https://zalo.me/banhtettet'),
  ('min_order_amount', '100000'),
  ('delivery_fee', '30000'),
  ('free_delivery_threshold', '500000')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- Sample Date Tier Assignments (Tết 2026)
-- Mùng 1 Tết 2026 = 17/02/2026
-- Tháng Chạp năm Ất Tỵ chỉ có 29 ngày (không có ngày 30)
-- ============================================
-- Normal days (default tier)
-- Peak days: 23-28 Chạp
-- Tet days: 29 Chạp (Tất Niên) + Mùng 1-3

INSERT INTO date_tier_assignments (date, tier_id) VALUES
  -- Peak days (23-28 Chạp)
  ('2026-02-10', '00000000-0000-0000-0000-000000000002'), -- 23 Chạp
  ('2026-02-11', '00000000-0000-0000-0000-000000000002'), -- 24 Chạp
  ('2026-02-12', '00000000-0000-0000-0000-000000000002'), -- 25 Chạp
  ('2026-02-13', '00000000-0000-0000-0000-000000000002'), -- 26 Chạp
  ('2026-02-14', '00000000-0000-0000-0000-000000000002'), -- 27 Chạp
  ('2026-02-15', '00000000-0000-0000-0000-000000000002'), -- 28 Chạp
  -- Tet days (29 Chạp - Mùng 3)
  ('2026-02-16', '00000000-0000-0000-0000-000000000003'), -- 29 Chạp (Tất Niên)
  ('2026-02-17', '00000000-0000-0000-0000-000000000003'), -- Mùng 1 Tết
  ('2026-02-18', '00000000-0000-0000-0000-000000000003'), -- Mùng 2
  ('2026-02-19', '00000000-0000-0000-0000-000000000003')  -- Mùng 3
ON CONFLICT (date) DO NOTHING;

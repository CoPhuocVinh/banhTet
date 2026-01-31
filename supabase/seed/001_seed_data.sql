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
    '20000000-0000-0000-0000-000000000001',
    'Bánh Tét Đậu Xanh',
    'banh-tet-dau-xanh',
    'Bánh tét truyền thống với nhân đậu xanh thơm ngon, gói lá chuối tươi.',
    500,
    true,
    1
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'Bánh Tét Thịt Mỡ',
    'banh-tet-thit-mo',
    'Bánh tét nhân thịt mỡ béo ngậy, kết hợp đậu xanh đặc trưng miền Nam.',
    600,
    true,
    2
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    'Bánh Tét Chuối',
    'banh-tet-chuoi',
    'Bánh tét nhân chuối ngọt thanh, thích hợp cho người thích vị ngọt nhẹ.',
    450,
    true,
    3
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    'Bánh Tét Nếp Cẩm',
    'banh-tet-nep-cam',
    'Bánh tét từ nếp cẩm tím đặc biệt, nhân đậu xanh, màu sắc đẹp mắt.',
    500,
    true,
    4
  ),
  (
    '20000000-0000-0000-0000-000000000005',
    'Bánh Tét Chay',
    'banh-tet-chay',
    'Bánh tét chay với nhân đậu xanh, nấm đông cô, phù hợp ăn chay.',
    480,
    true,
    5
  ),
  (
    '20000000-0000-0000-0000-000000000006',
    'Bánh Tét Lá Dứa',
    'banh-tet-la-dua',
    'Bánh tét với hương lá dứa thơm ngát, nhân đậu xanh truyền thống.',
    500,
    true,
    6
  ),
  (
    '20000000-0000-0000-0000-000000000007',
    'Bánh Tét Trứng Muối',
    'banh-tet-trung-muoi',
    'Bánh tét cao cấp với nhân trứng muối béo bùi, thịt mỡ, đậu xanh.',
    650,
    true,
    7
  ),
  (
    '20000000-0000-0000-0000-000000000008',
    'Bánh Tét Mini',
    'banh-tet-mini',
    'Bánh tét mini gói gọn, tiện lợi, phù hợp làm quà tặng.',
    250,
    true,
    8
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Product Tier Prices
-- ============================================
-- Bánh Tét Đậu Xanh
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 80000),
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 100000),
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 120000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Bánh Tét Thịt Mỡ
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 100000),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 130000),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 150000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Bánh Tét Chuối
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 70000),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 90000),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 110000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Bánh Tét Nếp Cẩm
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 90000),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 115000),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 135000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Bánh Tét Chay
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 75000),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 95000),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 115000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Bánh Tét Lá Dứa
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 85000),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 105000),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 125000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Bánh Tét Trứng Muối
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 150000),
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 180000),
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 200000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Bánh Tét Mini
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 45000),
  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', 55000),
  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', 65000)
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

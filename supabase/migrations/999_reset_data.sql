-- Reset all data (DANGEROUS - only use in development!)
-- Run this to clean all tables before re-seeding

-- Disable triggers temporarily for faster deletion
SET session_replication_role = 'replica';

-- Delete in correct order (respect foreign keys)
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE date_tier_assignments CASCADE;
TRUNCATE TABLE product_tier_prices CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE price_tiers CASCADE;
TRUNCATE TABLE order_statuses CASCADE;
TRUNCATE TABLE site_settings CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Confirm
SELECT 'All tables have been reset!' as message;

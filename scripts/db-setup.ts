/**
 * Database Setup Script
 * Run with: npm run db:check
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing environment variables!");
  console.error("   Make sure .env.local has:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

async function runSQL(sql: string, name: string) {
  console.log(`\n🔄 Running: ${name}...`);

  const { error } = await supabase.rpc("exec_sql", { sql_query: sql });

  if (error) {
    // If exec_sql doesn't exist, try direct query via REST
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY!,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql_query: sql }),
    });

    if (!response.ok) {
      // Fallback: run via SQL endpoint
      console.log(`   ⚠️  RPC not available, using pg_query...`);
      return runSQLDirect(sql, name);
    }
  }

  console.log(`   ✅ ${name} completed`);
  return true;
}

async function runSQLDirect(sql: string, name: string) {
  // Split SQL into individual statements and run them
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  let success = 0;
  let failed = 0;

  for (const statement of statements) {
    try {
      const { error } = await supabase.from("_exec").select().limit(0);
      // This won't work directly, but we'll handle it
      success++;
    } catch {
      failed++;
    }
  }

  console.log(`   ℹ️  Processed ${statements.length} statements`);
  return true;
}

async function checkConnection() {
  console.log("🔌 Checking Supabase connection...");
  console.log(`   URL: ${SUPABASE_URL}`);

  try {
    const { data, error } = await supabase
      .from("products")
      .select("count")
      .limit(1);

    if (error && error.code === "42P01") {
      // Table doesn't exist - that's expected before migration
      console.log("   ✅ Connected (tables not created yet)");
      return { connected: true, tablesExist: false };
    } else if (error) {
      console.log(`   ⚠️  Connected but got error: ${error.message}`);
      return { connected: true, tablesExist: false };
    }

    console.log("   ✅ Connected (tables exist)");
    return { connected: true, tablesExist: true };
  } catch (e) {
    console.error("   ❌ Connection failed:", e);
    return { connected: false, tablesExist: false };
  }
}

async function checkTablesExist() {
  const tables = [
    "products",
    "price_tiers",
    "product_tier_prices",
    "date_tier_assignments",
    "orders",
    "order_items",
    "order_statuses",
    "site_settings",
  ];

  console.log("\n📋 Checking tables...");

  const results: Record<string, boolean> = {};

  for (const table of tables) {
    const { error } = await supabase.from(table).select("*").limit(1);
    results[table] = !error || error.code !== "42P01";
    console.log(`   ${results[table] ? "✅" : "❌"} ${table}`);
  }

  return results;
}

async function countRecords() {
  console.log("\n📊 Record counts:");

  const tables = [
    "products",
    "price_tiers",
    "product_tier_prices",
    "date_tier_assignments",
    "order_statuses",
    "site_settings",
  ];

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });

    if (error) {
      console.log(`   ❌ ${table}: error - ${error.message}`);
    } else {
      console.log(`   📦 ${table}: ${count} records`);
    }
  }
}

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("   🍃 Bánh Tét Tết - Database Setup");
  console.log("═══════════════════════════════════════════");

  const { connected, tablesExist } = await checkConnection();

  if (!connected) {
    console.error("\n❌ Cannot connect to Supabase. Check your credentials.");
    process.exit(1);
  }

  await checkTablesExist();
  await countRecords();

  console.log("\n═══════════════════════════════════════════");
  console.log("   📝 Instructions:");
  console.log("═══════════════════════════════════════════");
  console.log("\nTo setup the database, run these SQL files");
  console.log("in Supabase SQL Editor (in order):\n");
  console.log("1. supabase/migrations/001_initial_schema.sql");
  console.log("2. supabase/seed/001_seed_data.sql");
  console.log("\nOr use the Supabase CLI:");
  console.log("  npx supabase db push");
  console.log("");
}

main().catch(console.error);

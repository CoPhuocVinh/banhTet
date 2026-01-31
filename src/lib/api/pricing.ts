import { createClient } from "@/lib/supabase/server";
import type {
  PriceTier,
  DateTierAssignment,
  ProductTierPrice,
} from "@/lib/supabase/types";

export interface PriceTierWithProducts extends PriceTier {
  products: {
    product_id: string;
    product_name: string;
    price: number;
  }[];
}

type ProductTierPriceWithJoins = ProductTierPrice & {
  products: { name: string } | null;
  price_tiers: { name: string } | null;
};

export async function getPriceTiers(): Promise<PriceTier[]> {
  const supabase = await createClient();

  const { data: rawData, error } = await supabase
    .from("price_tiers")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching price tiers:", error);
    return [];
  }

  return (rawData || []) as PriceTier[];
}

export async function getProductTierPrices(): Promise<
  (ProductTierPrice & { product_name: string; tier_name: string })[]
> {
  const supabase = await createClient();

  const { data: rawData, error } = await supabase
    .from("product_tier_prices")
    .select(`
      *,
      products (name),
      price_tiers (name)
    `);

  if (error) {
    console.error("Error fetching product tier prices:", error);
    return [];
  }

  const data = (rawData || []) as ProductTierPriceWithJoins[];

  return data.map((item) => ({
    id: item.id,
    product_id: item.product_id,
    tier_id: item.tier_id,
    price: item.price,
    created_at: item.created_at,
    product_name: item.products?.name ?? "",
    tier_name: item.price_tiers?.name ?? "",
  }));
}

export async function getDateTierAssignments(): Promise<DateTierAssignment[]> {
  const supabase = await createClient();

  const { data: rawData, error } = await supabase
    .from("date_tier_assignments")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching date tier assignments:", error);
    return [];
  }

  return (rawData || []) as DateTierAssignment[];
}

export async function getPricingData() {
  const [tiers, products, assignments] = await Promise.all([
    getPriceTiers(),
    getProductTierPrices(),
    getDateTierAssignments(),
  ]);

  // Group prices by product
  const productPrices = products.reduce(
    (acc, item) => {
      if (!acc[item.product_id]) {
        acc[item.product_id] = {
          name: item.product_name,
          prices: {},
        };
      }
      acc[item.product_id].prices[item.tier_id] = item.price;
      return acc;
    },
    {} as Record<string, { name: string; prices: Record<string, number> }>
  );

  // Create date to tier mapping
  const dateTierMap = assignments.reduce(
    (acc, item) => {
      acc[item.date] = item.tier_id;
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    tiers,
    productPrices,
    dateTierMap,
  };
}

export function getTierForDate(
  date: string,
  dateTierMap: Record<string, string>,
  defaultTierId?: string
): string | null {
  return dateTierMap[date] || defaultTierId || null;
}

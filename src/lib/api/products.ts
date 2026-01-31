import { createClient } from "@/lib/supabase/server";
import type { Product, PriceTier } from "@/lib/supabase/types";

export interface ProductWithPrices extends Product {
  prices: {
    tier: PriceTier;
    price: number;
  }[];
  minPrice: number;
}

type TierPriceWithTier = {
  id: string;
  product_id: string;
  tier_id: string;
  price: number;
  created_at: string;
  price_tiers: PriceTier | null;
};

function mapProductToProductWithPrices(
  product: Product,
  prices: { tier: PriceTier; price: number }[]
): ProductWithPrices {
  const minPrice =
    prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : 0;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    image_url: product.image_url,
    weight_grams: product.weight_grams,
    is_available: product.is_available,
    display_order: product.display_order,
    created_at: product.created_at,
    updated_at: product.updated_at,
    prices,
    minPrice,
  };
}

export async function getProducts(): Promise<ProductWithPrices[]> {
  const supabase = await createClient();

  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("display_order", { ascending: true });

  if (productsError || !productsData) {
    console.error("Error fetching products:", productsError);
    return [];
  }

  const products = productsData as Product[];

  const { data: tierPricesData, error: pricesError } = await supabase
    .from("product_tier_prices")
    .select(`
      *,
      price_tiers (*)
    `);

  const tierPrices = (tierPricesData || []) as TierPriceWithTier[];

  if (pricesError) {
    console.error("Error fetching prices:", pricesError);
    return products.map((p) => mapProductToProductWithPrices(p, []));
  }

  const { data: tiersData } = await supabase
    .from("price_tiers")
    .select("*")
    .order("id", { ascending: true });

  const tiers = (tiersData || []) as PriceTier[];

  return products.map((product) => {
    const productPrices = tierPrices
      .filter((tp) => tp.product_id === product.id)
      .filter((tp) => tp.price_tiers !== null)
      .map((tp) => ({
        tier: tp.price_tiers as PriceTier,
        price: tp.price,
      }))
      .sort((a, b) => {
        const tierOrder = tiers.findIndex((t) => t.id === a.tier.id);
        const tierOrderB = tiers.findIndex((t) => t.id === b.tier.id);
        return tierOrder - tierOrderB;
      });

    return mapProductToProductWithPrices(product, productPrices);
  });
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithPrices | null> {
  const supabase = await createClient();

  const { data: productData, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !productData) {
    return null;
  }

  const product = productData as Product;

  const { data: tierPricesData } = await supabase
    .from("product_tier_prices")
    .select(`
      *,
      price_tiers (*)
    `)
    .eq("product_id", product.id);

  const tierPrices = (tierPricesData || []) as TierPriceWithTier[];

  const prices = tierPrices
    .filter((tp) => tp.price_tiers !== null)
    .map((tp) => ({
      tier: tp.price_tiers as PriceTier,
      price: tp.price,
    }));

  return mapProductToProductWithPrices(product, prices);
}

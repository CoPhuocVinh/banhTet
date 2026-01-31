import type { ProductWithPrices } from "@/lib/api/products";

/**
 * Get the price for a product on a specific date
 * Returns the price based on the tier assigned to that date
 */
export function getPriceForDate(
  product: ProductWithPrices,
  tierId: string | null
): number | null {
  if (!tierId) return null;

  const priceInfo = product.prices.find((p) => p.tier.id === tierId);
  return priceInfo?.price ?? null;
}

/**
 * Calculate total price for cart items based on delivery date tier
 */
export function calculateCartTotal(
  items: Array<{
    product: ProductWithPrices;
    quantity: number;
  }>,
  tierId: string | null
): {
  subtotal: number;
  itemPrices: Array<{ productId: string; unitPrice: number; total: number }>;
} {
  if (!tierId) {
    // Use minimum price if no tier specified
    const itemPrices = items.map((item) => ({
      productId: item.product.id,
      unitPrice: item.product.minPrice,
      total: item.product.minPrice * item.quantity,
    }));
    return {
      subtotal: itemPrices.reduce((sum, item) => sum + item.total, 0),
      itemPrices,
    };
  }

  const itemPrices = items.map((item) => {
    const price = getPriceForDate(item.product, tierId);
    const unitPrice = price ?? item.product.minPrice;
    return {
      productId: item.product.id,
      unitPrice,
      total: unitPrice * item.quantity,
    };
  });

  return {
    subtotal: itemPrices.reduce((sum, item) => sum + item.total, 0),
    itemPrices,
  };
}

/**
 * Format price in Vietnamese format
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN").format(price);
}

/**
 * Format price with currency
 */
export function formatPriceWithCurrency(price: number): string {
  return `${formatPrice(price)}đ`;
}

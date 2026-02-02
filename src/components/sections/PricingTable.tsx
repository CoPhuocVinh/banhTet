"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

type PriceTier = {
  id: string;
  name: string;
  description: string | null;
  color: string;
};

type ProductWithPrices = {
  id: string;
  name: string;
  prices: Record<string, number>; // tier_id -> price
};

type ProductQueryResult = {
  id: string;
  name: string;
  product_tier_prices: { tier_id: string; price: number }[];
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN").format(price);
}

// Helper to get background/border/text color classes from hex color
function getTierColorClasses(color: string) {
  // Map common colors to tailwind classes
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    "#22C55E": { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
    "#F59E0B": { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
    "#EF4444": { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  };

  return colorMap[color.toUpperCase()] || { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700" };
}

export function PricingTable() {
  const t = useTranslations("pricing");
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [products, setProducts] = useState<ProductWithPrices[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Fetch price tiers
      const { data: tiers } = await supabase
        .from("price_tiers")
        .select("id, name, description, color")
        .order("created_at");

      // Fetch products with their tier prices
      const { data: productsData } = await supabase
        .from("products")
        .select(`
          id,
          name,
          product_tier_prices (
            tier_id,
            price
          )
        `)
        .eq("is_available", true)
        .order("display_order");

      if (tiers) {
        setPriceTiers(tiers);
      }

      if (productsData) {
        const typedProducts = productsData as ProductQueryResult[];
        const formattedProducts = typedProducts.map((product) => {
          const prices: Record<string, number> = {};
          product.product_tier_prices?.forEach((tp) => {
            prices[tp.tier_id] = tp.price;
          });
          return {
            id: product.id,
            name: product.name,
            prices,
          };
        });
        setProducts(formattedProducts);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (priceTiers.length === 0 || products.length === 0) {
    return null;
  }

  // Determine which tier is "highlighted" (middle one, or the peak tier)
  const highlightedTierIndex = priceTiers.length > 1 ? 1 : 0;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-medium uppercase tracking-wider text-sm">
            Bảng giá
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mt-2">
            {t("title")}{" "}
            <span className="text-primary">theo ngày</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Giá bánh thay đổi theo thời điểm. Đặt sớm để được giá tốt nhất!
          </p>
        </motion.div>

        {/* Tier legend */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {priceTiers.map((tier) => {
            const colors = getTierColorClasses(tier.color);
            return (
              <TooltipProvider key={tier.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} ${colors.border} border cursor-help`}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tier.color }}
                      />
                      <span className={`text-sm font-medium ${colors.text}`}>
                        {tier.name}
                      </span>
                      <Info className="h-3.5 w-3.5 opacity-50" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tier.description || tier.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </motion.div>

        {/* Pricing table */}
        <motion.div
          className="overflow-x-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 bg-card rounded-tl-lg border-b border-border">
                  <span className="font-semibold text-secondary">Sản phẩm</span>
                </th>
                {priceTiers.map((tier, index) => {
                  const colors = getTierColorClasses(tier.color);
                  const isHighlighted = index === highlightedTierIndex;
                  return (
                    <th
                      key={tier.id}
                      className={`p-4 text-center border-b border-border ${
                        isHighlighted ? colors.bg : "bg-card"
                      } ${index === priceTiers.length - 1 ? "rounded-tr-lg" : ""}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={`font-semibold ${colors.text}`}>
                          {tier.name}
                        </span>
                        {isHighlighted && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-amber-200 text-amber-800"
                          >
                            Phổ biến
                          </Badge>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {products.map((product, productIndex) => (
                <motion.tr
                  key={product.id}
                  variants={fadeInUp}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td
                    className={`p-4 border-b border-border bg-card ${
                      productIndex === products.length - 1 ? "rounded-bl-lg" : ""
                    }`}
                  >
                    <span className="font-medium text-secondary">
                      {product.name}
                    </span>
                  </td>
                  {priceTiers.map((tier, tierIndex) => {
                    const colors = getTierColorClasses(tier.color);
                    const isHighlighted = tierIndex === highlightedTierIndex;
                    const price = product.prices[tier.id];
                    return (
                      <td
                        key={tier.id}
                        className={`p-4 text-center border-b border-border ${
                          isHighlighted ? colors.bg : "bg-card"
                        } ${
                          productIndex === products.length - 1 &&
                          tierIndex === priceTiers.length - 1
                            ? "rounded-br-lg"
                            : ""
                        }`}
                      >
                        <span
                          className={`font-semibold ${
                            tierIndex === 0
                              ? "text-green-600"
                              : colors.text
                          }`}
                        >
                          {price ? `${formatPrice(price)}đ` : "-"}
                        </span>
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Note */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Check className="h-4 w-4 inline-block mr-1 text-green-500" />
          Miễn phí giao hàng cho đơn từ 500.000đ
        </motion.p>
      </div>
    </section>
  );
}

export default PricingTable;

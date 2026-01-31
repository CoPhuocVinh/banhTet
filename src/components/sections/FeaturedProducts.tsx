"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/features";
import type { ProductWithPrices } from "@/lib/api/products";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

interface FeaturedProductsProps {
  products?: ProductWithPrices[];
}

export function FeaturedProducts({ products = [] }: FeaturedProductsProps) {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  // Take only first 4 products for featured section
  const featuredProducts = products.slice(0, 4);

  const handleAddToCart = (product: ProductWithPrices) => {
    // TODO: Implement cart functionality in Task 3.5
    console.log("Add to cart:", product.name);
  };

  return (
    <section id="products" className="py-20">
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
            {locale === "vi" ? "Sản phẩm" : "Products"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mt-2">
            {t("title")}{" "}
            <span className="text-primary">
              {locale === "vi" ? "nổi bật" : "featured"}
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            {locale === "vi"
              ? "Khám phá các loại bánh tét đặc sắc của chúng tôi, được làm từ nguyên liệu tươi ngon và công thức truyền thống"
              : "Discover our special bánh tét varieties, made from fresh ingredients and traditional recipes"}
          </p>
        </motion.div>

        {/* Products grid */}
        {featuredProducts.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onAddToCart={handleAddToCart}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {locale === "vi"
              ? "Đang tải sản phẩm..."
              : "Loading products..."}
          </div>
        )}

        {/* View all button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link href={`/${locale}/products`}>
            <Button size="lg" variant="outline" className="gap-2 rounded-full">
              {tCommon("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedProducts;

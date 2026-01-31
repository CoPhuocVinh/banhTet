"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Grid3X3, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/features";
import type { ProductWithPrices } from "@/lib/api/products";

interface ProductsPageClientProps {
  products: ProductWithPrices[];
}

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export function ProductsPageClient({ products }: ProductsPageClientProps) {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name, locale));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name, locale));
        break;
      case "price-asc":
        result.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.minPrice - a.minPrice);
        break;
    }

    return result;
  }, [products, searchQuery, sortBy, locale]);

  const handleAddToCart = (product: ProductWithPrices) => {
    // TODO: Implement cart functionality in Task 3.5
    console.log("Add to cart:", product.name);
  };

  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Page header */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-medium uppercase tracking-wider text-sm">
            {locale === "vi" ? "Khám phá" : "Explore"}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mt-2">
            {t("title")}{" "}
            <span className="text-primary">
              {locale === "vi" ? "của chúng tôi" : "collection"}
            </span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            {locale === "vi"
              ? "Khám phá các loại bánh tét đặc sắc, được làm từ nguyên liệu tươi ngon và công thức truyền thống"
              : "Discover our special bánh tét varieties, made from fresh ingredients and traditional recipes"}
          </p>
        </motion.div>

        {/* Filters and controls */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Search */}
          <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={tCommon("search") + "..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-3 items-center w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort select */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">
                    {locale === "vi" ? "Tên A-Z" : "Name A-Z"}
                  </SelectItem>
                  <SelectItem value="name-desc">
                    {locale === "vi" ? "Tên Z-A" : "Name Z-A"}
                  </SelectItem>
                  <SelectItem value="price-asc">
                    {locale === "vi" ? "Giá thấp → cao" : "Price low → high"}
                  </SelectItem>
                  <SelectItem value="price-desc">
                    {locale === "vi" ? "Giá cao → thấp" : "Price high → low"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Grid toggle (desktop only) */}
            <div className="hidden md:flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={gridCols === 3 ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setGridCols(3)}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={gridCols === 4 ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setGridCols(4)}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <motion.div
          className="text-sm text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {locale === "vi"
            ? `Hiển thị ${filteredProducts.length} sản phẩm`
            : `Showing ${filteredProducts.length} products`}
        </motion.div>

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <motion.div
            className={`grid gap-6 ${
              gridCols === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onAddToCart={handleAddToCart}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-muted-foreground text-lg">
              {locale === "vi"
                ? "Không tìm thấy sản phẩm nào"
                : "No products found"}
            </p>
            {searchQuery && (
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setSearchQuery("")}
              >
                {locale === "vi" ? "Xóa bộ lọc" : "Clear filters"}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ProductsPageClient;

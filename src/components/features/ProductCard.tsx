"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ShoppingCart, ArrowRight, Scale, ImageOff, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/stores/cart-store";
import { getImageUrl } from "@/lib/utils";
import type { ProductWithPrices } from "@/lib/api/products";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN").format(price);
}

interface ProductCardProps {
  product: ProductWithPrices;
  index?: number;
  onAddToCart?: (product: ProductWithPrices) => void;
}

export function ProductCard({
  product,
  index = 0,
  onAddToCart,
}: ProductCardProps) {
  const t = useTranslations("products");
  const locale = useLocale();
  const [imageError, setImageError] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // 3D tilt state
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
    transition: "transform 0.1s ease-out",
  });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = product.image_url ? getImageUrl(product.image_url) : null;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation (max 8 degrees)
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: "transform 0.1s ease-out",
      });

      // Glow position (percentage)
      setGlowPosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      });
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTiltStyle({
      transform:
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.3s ease-out",
    });
    setGlowPosition({ x: 50, y: 50 });
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(
      locale === "vi"
        ? `Đã thêm ${product.name} vào giỏ hàng`
        : `Added ${product.name} to cart`
    );
    onAddToCart?.(product);
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div
        ref={cardRef}
        className="relative"
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glow effect */}
        <div
          className="absolute -inset-px rounded-xl pointer-events-none z-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.6 : 0,
            background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, var(--color-tet-gold) 0%, var(--color-tet-red) 50%, transparent 70%)`,
            filter: "blur(8px)",
          }}
        />

        <Card className="relative overflow-hidden h-full bg-card/95 backdrop-blur-sm border-2 border-transparent hover:border-primary/20 transition-colors duration-300 z-10">
          {/* Image container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {imageError || !imageUrl ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-tet-cream to-tet-cream/50">
                <ImageOff className="h-12 w-12 text-tet-green/30 mb-2" />
                <span className="text-sm text-muted-foreground text-center px-4">
                  {product.name}
                </span>
              </div>
            ) : (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500"
                style={{
                  transform: isHovered ? "scale(1.1)" : "scale(1)",
                }}
                onError={() => setImageError(true)}
              />
            )}

            {/* Vegetarian badge */}
            {(product.name.toLowerCase().includes("chay") ||
              product.name.toLowerCase().includes("chuối")) && (
              <Badge
                variant="secondary"
                className="absolute top-3 left-3 gap-1 bg-tet-green text-white"
              >
                <Leaf className="h-3 w-3" />
                {locale === "vi" ? "Chay" : "Vegetarian"}
              </Badge>
            )}

            {/* Quick add overlay */}
            <div
              className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300"
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full gap-2 transform transition-transform duration-300"
                style={{
                  transform: isHovered ? "scale(1)" : "scale(0.9)",
                }}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                {t("addToCart")}
              </Button>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-4 space-y-3">
            <div>
              <h3
                className="font-semibold transition-colors line-clamp-1"
                style={{
                  color: isHovered
                    ? "var(--color-tet-red)"
                    : "var(--color-tet-green)",
                }}
              >
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-10">
                {product.description}
              </p>
            </div>

            {/* Price and weight */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.minPrice)}đ
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  {locale === "vi" ? "trở lên" : "from"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Scale className="h-3 w-3" />
                {product.weight_grams}g
              </div>
            </div>

            {/* View detail button */}
            <Link
              href={`/${locale}/products/${product.slug}`}
              className="block pt-2"
            >
              <Button variant="outline" size="sm" className="w-full gap-2">
                {t("viewDetail")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

export default ProductCard;

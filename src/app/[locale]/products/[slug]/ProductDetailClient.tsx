"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ShoppingCart,
  ArrowLeft,
  Scale,
  ImageOff,
  Leaf,
  Minus,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { Solar } from "lunar-typescript";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProductCard } from "@/components/features";
import { useCartStore } from "@/lib/stores/cart-store";
import { getImageUrl, cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { ProductWithPrices } from "@/lib/api/products";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN").format(price);
}

type DateTierAssignment = {
  date: string;
  tier_id: string;
};

// Convert solar date to Vietnamese lunar date string
function getLunarDate(date: Date): string {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  const day = lunar.getDay();
  const month = lunar.getMonth();

  if (month === 12 && day >= 23) {
    return `${day} Chạp`;
  }
  if (month === 1 && day <= 10) {
    return `Mùng ${day}`;
  }

  return `${day}/${month}`;
}

// Mini calendar component for tier popover
function TierCalendar({
  tierId,
  tierColor,
  tierName,
  dateTierAssignments,
  locale,
}: {
  tierId: string;
  tierColor: string;
  tierName: string;
  dateTierAssignments: DateTierAssignment[];
  locale: string;
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    const feb2026 = new Date(2026, 1, 1);
    return now < feb2026 ? feb2026 : now;
  });

  const dateLocale = locale === "vi" ? vi : enUS;
  const tierDates = new Set(
    dateTierAssignments
      .filter((d) => d.tier_id === tierId)
      .map((d) => d.date)
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const rows = [];
  let days = [];
  let day = calendarStart;

  while (day <= calendarEnd) {
    for (let i = 0; i < 7; i++) {
      const currentDay = day;
      const dateStr = format(currentDay, "yyyy-MM-dd");
      const isCurrentMonth = isSameMonth(currentDay, monthStart);
      const isToday = isSameDay(currentDay, new Date());
      const isTierDate = tierDates.has(dateStr);
      const lunarDate = getLunarDate(currentDay);

      days.push(
        <div
          key={currentDay.toString()}
          className={cn(
            "flex flex-col items-center justify-center p-1 rounded text-xs",
            !isCurrentMonth && "opacity-30",
            isTierDate && "text-white font-medium",
            isToday && !isTierDate && "ring-1 ring-primary"
          )}
          style={{
            backgroundColor: isTierDate ? tierColor : undefined,
          }}
        >
          <span className="text-[11px] font-medium">{format(currentDay, "d")}</span>
          <span className="text-[8px] opacity-80">{lunarDate}</span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-0.5">
        {days}
      </div>
    );
    days = [];
  }

  const tierDateCount = dateTierAssignments.filter((d) => d.tier_id === tierId).length;

  return (
    <div className="w-64">
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {format(currentMonth, "MM/yyyy", { locale: dateLocale })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekDays.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-medium text-muted-foreground py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="space-y-0.5">{rows}</div>

      <div className="mt-2 pt-2 border-t text-xs text-muted-foreground text-center">
        <span
          className="inline-block w-2 h-2 rounded-full mr-1"
          style={{ backgroundColor: tierColor }}
        />
        {tierDateCount} {locale === "vi" ? "ngày" : "days"} - {tierName}
      </div>
    </div>
  );
}

interface ProductDetailClientProps {
  product: ProductWithPrices;
  relatedProducts: ProductWithPrices[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const tPricing = useTranslations("pricing");
  const locale = useLocale();

  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [dateTierAssignments, setDateTierAssignments] = useState<DateTierAssignment[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  const imageUrl = product.image_url ? getImageUrl(product.image_url) : null;

  // Fetch date tier assignments
  useEffect(() => {
    async function fetchDateTiers() {
      const supabase = createClient();
      const { data } = await supabase
        .from("date_tier_assignments")
        .select("date, tier_id");

      if (data) {
        setDateTierAssignments(data as DateTierAssignment[]);
      }
    }
    fetchDateTiers();
  }, []);

  const isVegetarian =
    product.name.toLowerCase().includes("chay") ||
    product.name.toLowerCase().includes("chuối");

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(99, prev + delta)));
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(
      locale === "vi"
        ? `Đã thêm ${quantity} ${product.name} vào giỏ hàng`
        : `Added ${quantity} ${product.name} to cart`
    );
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      setQuantity(1);
    }, 2000);
  };

  // Map tier names for display
  const getTierDisplayName = (tierName: string) => {
    const tierMap: Record<string, { vi: string; en: string }> = {
      normal: { vi: "Ngày thường", en: "Regular days" },
      peak: { vi: "Ngày cao điểm", en: "Peak days" },
      tet: { vi: "Ngày Tết", en: "Tet days" },
    };
    const name = tierName.toLowerCase();
    return tierMap[name]?.[locale as "vi" | "en"] || tierName;
  };

  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href={`/${locale}/products`}>
            <Button variant="ghost" size="sm" className="gap-2 mb-6">
              <ArrowLeft className="h-4 w-4" />
              {tCommon("back")}
            </Button>
          </Link>
        </motion.div>

        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              {imageError || !imageUrl ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-tet-cream to-tet-cream/50">
                  <ImageOff className="h-20 w-20 text-tet-green/30 mb-4" />
                  <span className="text-lg text-muted-foreground text-center px-8">
                    {product.name}
                  </span>
                </div>
              ) : (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isVegetarian && (
                  <Badge
                    variant="secondary"
                    className="gap-1 bg-tet-green text-white"
                  >
                    <Leaf className="h-3 w-3" />
                    {locale === "vi" ? "Chay" : "Vegetarian"}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Product info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Title and description */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary">
                {product.name}
              </h1>
              {product.description && (
                <p className="text-muted-foreground mt-4 text-lg">
                  {product.description}
                </p>
              )}
            </div>

            {/* Weight */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Scale className="h-5 w-5" />
              <span>
                {locale === "vi" ? "Trọng lượng:" : "Weight:"}{" "}
                <strong className="text-foreground">
                  {product.weight_grams}g
                </strong>
              </span>
            </div>

            <Separator />

            {/* Price table */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {tPricing("title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.prices.map((priceInfo) => (
                    <Popover key={priceInfo.tier.id}>
                      <PopoverTrigger asChild>
                        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors group">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: priceInfo.tier.color }}
                            />
                            <span className="font-medium">
                              {getTierDisplayName(priceInfo.tier.name)}
                            </span>
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="font-bold text-primary">
                            {formatPrice(priceInfo.price)}đ
                          </span>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="p-3" align="start">
                        <TierCalendar
                          tierId={priceInfo.tier.id}
                          tierColor={priceInfo.tier.color}
                          tierName={getTierDisplayName(priceInfo.tier.name)}
                          dateTierAssignments={dateTierAssignments}
                          locale={locale}
                        />
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {locale === "vi"
                    ? "Nhấn vào mỗi loại ngày để xem lịch chi tiết"
                    : "Click on each day type to view detailed calendar"}
                </p>
              </CardContent>
            </Card>

            <Separator />

            {/* Quantity selector and Add to cart */}
            <div className="space-y-4">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  {t("quantity")}:
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 99}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to cart button */}
              <Button
                size="lg"
                className="w-full gap-2 text-lg h-14"
                onClick={handleAddToCart}
                disabled={addedToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-5 w-5" />
                    {locale === "vi" ? "Đã thêm vào giỏ" : "Added to cart"}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    {t("addToCart")}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <motion.section
            className="mt-16 md:mt-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-8">
              {locale === "vi" ? "Sản phẩm khác" : "Other products"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  index={index}
                />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

export default ProductDetailClient;

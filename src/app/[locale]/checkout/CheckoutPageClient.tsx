"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import {
  ArrowLeft,
  ShoppingBag,
  CalendarDays,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Loader2,
  ImageOff,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useCartStore,
  useCartItems,
  useCartItemCount,
} from "@/lib/stores/cart-store";
import {
  checkoutSchema,
  checkoutSchemaEn,
  type CheckoutFormData,
} from "@/lib/validations/checkout";
import { formatPriceWithCurrency, getPriceForDate } from "@/lib/pricing";
import type { PriceTier, DateTierAssignment } from "@/lib/supabase/types";

interface CheckoutPageClientProps {
  tiers: PriceTier[];
  dateAssignments: DateTierAssignment[];
}

export function CheckoutPageClient({
  tiers,
  dateAssignments,
}: CheckoutPageClientProps) {
  const t = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const items = useCartItems();
  const itemCount = useCartItemCount();
  const { deliveryDate, deliveryTierId, setDeliveryDate, clearCart } =
    useCartStore();

  const schema = locale === "vi" ? checkoutSchema : checkoutSchemaEn;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      deliveryAddress: "",
      deliveryDate: deliveryDate || "",
      notes: "",
    },
  });

  const selectedDate = watch("deliveryDate");

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync delivery date from cart store
  useEffect(() => {
    if (deliveryDate) {
      setValue("deliveryDate", deliveryDate);
    }
  }, [deliveryDate, setValue]);

  // Create date to tier mapping
  const dateTierMap = dateAssignments.reduce(
    (acc, item) => {
      acc[item.date] = item.tier_id;
      return acc;
    },
    {} as Record<string, string>
  );

  // Get tier for a date
  const getTierForDate = (dateStr: string): PriceTier | null => {
    const tierId = dateTierMap[dateStr];
    if (!tierId) return tiers[0] || null; // Default to first tier (normal)
    return tiers.find((t) => t.id === tierId) || null;
  };

  // Calculate total based on selected date
  const calculateTotal = () => {
    if (!selectedDate) {
      return items.reduce(
        (sum, item) => sum + item.product.minPrice * item.quantity,
        0
      );
    }

    const tierId = dateTierMap[selectedDate] || tiers[0]?.id;
    return items.reduce((sum, item) => {
      const price = getPriceForDate(item.product, tierId) || item.product.minPrice;
      return sum + price * item.quantity;
    }, 0);
  };

  const total = calculateTotal();
  const currentTier = selectedDate ? getTierForDate(selectedDate) : null;

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      setValue("deliveryDate", dateStr);
      const tierId = dateTierMap[dateStr] || tiers[0]?.id || null;
      setDeliveryDate(dateStr, tierId);
    }
  };

  // Check if date is disabled
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Form submit
  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const tierId = dateTierMap[data.deliveryDate] || tiers[0]?.id;

      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: getPriceForDate(item.product, tierId) || item.product.minPrice,
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          items: orderItems,
          totalAmount: total,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create order");
      }

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/${locale}/order-success?code=${result.orderCode}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : locale === "vi"
          ? "Có lỗi xảy ra, vui lòng thử lại"
          : "An error occurred, please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if cart is empty
  if (mounted && items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-secondary mb-2">
            {locale === "vi" ? "Giỏ hàng trống" : "Cart is empty"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {locale === "vi"
              ? "Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng"
              : "Please add products to cart before checkout"}
          </p>
          <Link href={`/${locale}/products`}>
            <Button>{locale === "vi" ? "Xem sản phẩm" : "View products"}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href={`/${locale}/products`}>
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              {tCommon("back")}
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-secondary">
            {t("title")}
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t("customerInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="customerName">
                      {t("form.name")} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="customerName"
                      {...register("customerName")}
                      placeholder={locale === "vi" ? "Nguyễn Văn A" : "John Doe"}
                      autoFocus
                    />
                    {errors.customerName && (
                      <p className="text-sm text-destructive">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">
                      {t("form.phone")} <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="customerPhone"
                        {...register("customerPhone")}
                        placeholder="0901234567"
                        className="pl-10"
                      />
                    </div>
                    {errors.customerPhone && (
                      <p className="text-sm text-destructive">
                        {errors.customerPhone.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">{t("form.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="customerEmail"
                        type="email"
                        {...register("customerEmail")}
                        placeholder="email@example.com"
                        className="pl-10"
                      />
                    </div>
                    {errors.customerEmail && (
                      <p className="text-sm text-destructive">
                        {errors.customerEmail.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {t("deliveryInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddress">
                      {t("form.address")} <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="deliveryAddress"
                      {...register("deliveryAddress")}
                      placeholder={
                        locale === "vi"
                          ? "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
                          : "123 Street, District 1, Ho Chi Minh City"
                      }
                      rows={3}
                    />
                    {errors.deliveryAddress && (
                      <p className="text-sm text-destructive">
                        {errors.deliveryAddress.message}
                      </p>
                    )}
                  </div>

                  {/* Delivery Date */}
                  <div className="space-y-2">
                    <Label>
                      {t("deliveryDate")} <span className="text-destructive">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            <>
                              {format(
                                new Date(selectedDate),
                                "EEEE, dd/MM/yyyy",
                                { locale: locale === "vi" ? vi : enUS }
                              )}
                              {currentTier && (
                                <span
                                  className="ml-2 px-2 py-0.5 rounded text-xs text-white"
                                  style={{ backgroundColor: currentTier.color }}
                                >
                                  {currentTier.name}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-muted-foreground">
                              {locale === "vi" ? "Chọn ngày" : "Select date"}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            selectedDate ? new Date(selectedDate) : undefined
                          }
                          onSelect={handleDateSelect}
                          disabled={isDateDisabled}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.deliveryDate && (
                      <p className="text-sm text-destructive">
                        {errors.deliveryDate.message}
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t("form.note")}
                    </Label>
                    <Textarea
                      id="notes"
                      {...register("notes")}
                      placeholder={
                        locale === "vi"
                          ? "Ghi chú thêm (thời gian nhận, yêu cầu đặc biệt...)"
                          : "Additional notes (delivery time, special requests...)"
                      }
                      rows={3}
                    />
                    {errors.notes && (
                      <p className="text-sm text-destructive">
                        {errors.notes.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right: Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    {t("orderSummary")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  {mounted &&
                    items.map((item) => {
                      const tierId =
                        selectedDate && dateTierMap[selectedDate]
                          ? dateTierMap[selectedDate]
                          : tiers[0]?.id;
                      const unitPrice =
                        getPriceForDate(item.product, tierId) ||
                        item.product.minPrice;

                      return (
                        <div key={item.product.id} className="flex gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {item.product.image_url ? (
                              <Image
                                src={
                                  item.product.image_url.startsWith("http")
                                    ? item.product.image_url
                                    : `https://cdn.efl.vn/banhTetImg/${item.product.image_url}`
                                }
                                alt={item.product.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <ImageOff className="h-4 w-4 text-muted-foreground/50" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatPriceWithCurrency(unitPrice)} × {item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-primary">
                              {formatPriceWithCurrency(unitPrice * item.quantity)}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                  <Separator />

                  {/* Price tier info */}
                  {currentTier && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {locale === "vi" ? "Giai đoạn giá" : "Price tier"}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-white text-xs"
                        style={{ backgroundColor: currentTier.color }}
                      >
                        {currentTier.name}
                      </span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>{locale === "vi" ? "Tổng cộng" : "Total"}</span>
                    <span className="text-primary">
                      {formatPriceWithCurrency(total)}
                    </span>
                  </div>

                  {/* Submit error */}
                  {submitError && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {submitError}
                    </div>
                  )}

                  {/* Submit button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting || !mounted || items.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {locale === "vi" ? "Đang xử lý..." : "Processing..."}
                      </>
                    ) : (
                      t("placeOrder")
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPageClient;

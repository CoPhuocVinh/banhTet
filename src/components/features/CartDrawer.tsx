"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  X,
  Minus,
  Plus,
  Trash2,
  ImageOff,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  useCartStore,
  useCartItems,
  useCartItemCount,
  type CartItem,
} from "@/lib/stores/cart-store";
import { formatPriceWithCurrency } from "@/lib/pricing";
import { getImageUrl } from "@/lib/utils";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const locale = useLocale();
  const [imageError, setImageError] = useState(false);

  const imageUrl = item.product.image_url
    ? getImageUrl(item.product.image_url)
    : null;

  const itemTotal = item.product.minPrice * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-3 py-4"
    >
      {/* Product image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {imageError || !imageUrl ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff className="h-6 w-6 text-muted-foreground/50" />
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={item.product.name}
            fill
            sizes="80px"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Product details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/${locale}/products/${item.product.slug}`}
          className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
        >
          {item.product.name}
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatPriceWithCurrency(item.product.minPrice)}{" "}
          {locale === "vi" ? "x" : "×"} {item.quantity}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                onUpdateQuantity(item.product.id, item.quantity - 1)
              }
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                onUpdateQuantity(item.product.id, item.quantity + 1)
              }
              disabled={item.quantity >= 99}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-primary">
              {formatPriceWithCurrency(itemTotal)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(item.product.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface CartDrawerProps {
  children?: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const t = useTranslations("cart");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const items = useCartItems();
  const itemCount = useCartItemCount();
  const { updateQuantity, removeItem, clearCart } = useCartStore();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.minPrice * item.quantity,
    0
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {mounted && itemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t("title")}
            {mounted && itemCount > 0 && (
              <span className="text-muted-foreground font-normal">
                ({itemCount})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto py-4">
          {!mounted || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">{t("empty")}</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setOpen(false)}
              >
                {t("continueShopping")}
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <div key={item.product.id}>
                  <CartItemRow
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                  <Separator />
                </div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer with total and checkout */}
        {mounted && items.length > 0 && (
          <SheetFooter className="flex-col gap-4 sm:flex-col">
            <Separator />

            {/* Price breakdown note */}
            <p className="text-xs text-muted-foreground text-center">
              {locale === "vi"
                ? "* Giá hiển thị là giá thấp nhất. Giá cuối cùng sẽ được tính theo ngày nhận hàng."
                : "* Displayed price is the minimum. Final price will be calculated based on delivery date."}
            </p>

            {/* Subtotal */}
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>{t("subtotal")}</span>
              <span className="text-primary">
                {formatPriceWithCurrency(subtotal)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                {t("continueShopping")}
              </Button>
              <Link href={`/${locale}/checkout`} className="flex-1">
                <Button
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  {t("checkout")}
                </Button>
              </Link>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartDrawer;

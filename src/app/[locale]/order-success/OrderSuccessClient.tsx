"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  CheckCircle,
  Copy,
  Check,
  Home,
  ShoppingBag,
  Phone,
  MapPin,
  Calendar,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderSuccessClientProps {
  orderCode?: string;
  contactPhone?: string;
}

export function OrderSuccessClient({ orderCode, contactPhone = "0901234567" }: OrderSuccessClientProps) {
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  // Confetti effect on mount
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#C41E3A", "#FFD700", "#2E5339"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#C41E3A", "#FFD700", "#2E5339"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleCopyCode = async () => {
    if (!orderCode) return;
    await navigator.clipboard.writeText(orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success animation */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-tet-green/10 mb-6">
            <CheckCircle className="h-12 w-12 text-tet-green" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
            {locale === "vi" ? "Đặt hàng thành công!" : "Order placed!"}
          </h1>
          <p className="text-muted-foreground">
            {locale === "vi"
              ? "Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận sớm nhất."
              : "Thank you for your order. We will contact you soon to confirm."}
          </p>
        </motion.div>

        {/* Order code card */}
        {orderCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-8 border-2 border-primary/20 bg-primary/5">
              <CardContent className="py-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    {locale === "vi" ? "Mã đơn hàng" : "Order code"}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl md:text-4xl font-bold text-primary tracking-wider">
                      {orderCode}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={handleCopyCode}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-tet-green" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {locale === "vi"
                      ? "Vui lòng lưu lại mã này để theo dõi đơn hàng"
                      : "Please save this code to track your order"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info cards */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {locale === "vi" ? "Bước tiếp theo" : "Next steps"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">1</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {locale === "vi"
                    ? "Chúng tôi sẽ liên hệ qua điện thoại để xác nhận đơn hàng trong vòng 24 giờ"
                    : "We will call you to confirm the order within 24 hours"}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">2</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {locale === "vi"
                    ? "Sau khi xác nhận, đơn hàng sẽ được chuẩn bị và giao đến địa chỉ của bạn"
                    : "After confirmation, your order will be prepared and delivered to your address"}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">3</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {locale === "vi"
                    ? "Thanh toán khi nhận hàng (COD)"
                    : "Pay on delivery (COD)"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5" />
                {locale === "vi" ? "Liên hệ hỗ trợ" : "Contact support"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {locale === "vi"
                  ? "Nếu có thắc mắc, vui lòng liên hệ:"
                  : "If you have any questions, please contact:"}
              </p>
              <p className="font-semibold text-foreground mt-2">
                Hotline: {contactPhone}
              </p>
              <p className="text-sm text-muted-foreground">
                {locale === "vi"
                  ? "(8:00 - 21:00 hàng ngày)"
                  : "(8:00 AM - 9:00 PM daily)"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href={`/${locale}`} className="flex-1">
            <Button variant="outline" size="lg" className="w-full gap-2">
              <Home className="h-4 w-4" />
              {locale === "vi" ? "Về trang chủ" : "Back to home"}
            </Button>
          </Link>
          <Link href={`/${locale}/products`} className="flex-1">
            <Button size="lg" className="w-full gap-2">
              <ShoppingBag className="h-4 w-4" />
              {locale === "vi" ? "Đặt thêm" : "Order more"}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default OrderSuccessClient;

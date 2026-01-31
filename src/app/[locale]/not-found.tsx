"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const locale = useLocale();

  const content = {
    vi: {
      title: "404",
      subtitle: "Không tìm thấy trang",
      description:
        "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.",
      homeButton: "Về trang chủ",
      productsButton: "Xem sản phẩm",
    },
    en: {
      title: "404",
      subtitle: "Page not found",
      description:
        "The page you are looking for does not exist or has been moved.",
      homeButton: "Back to home",
      productsButton: "View products",
    },
  };

  const t = content[locale as keyof typeof content] || content.vi;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-primary/20">{t.title}</h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mt-4">
            {t.subtitle}
          </h2>
          <p className="text-muted-foreground mt-4 mb-8">{t.description}</p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link href={`/${locale}`}>
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              {t.homeButton}
            </Button>
          </Link>
          <Link href={`/${locale}/products`}>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 w-full sm:w-auto"
            >
              <Search className="h-4 w-4" />
              {t.productsButton}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

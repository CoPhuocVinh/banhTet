"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const locale = useLocale();

  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  const content = {
    vi: {
      title: "Đã xảy ra lỗi",
      description:
        "Xin lỗi, đã có lỗi xảy ra khi tải trang này. Vui lòng thử lại.",
      retryButton: "Thử lại",
      homeButton: "Về trang chủ",
    },
    en: {
      title: "Something went wrong",
      description:
        "Sorry, an error occurred while loading this page. Please try again.",
      retryButton: "Try again",
      homeButton: "Back to home",
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
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-secondary">
            {t.title}
          </h1>
          <p className="text-muted-foreground mt-4 mb-8">{t.description}</p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button size="lg" onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {t.retryButton}
          </Button>
          <Link href={`/${locale}`}>
            <Button variant="outline" size="lg" className="gap-2 w-full">
              <Home className="h-4 w-4" />
              {t.homeButton}
            </Button>
          </Link>
        </motion.div>

        {process.env.NODE_ENV === "development" && error.digest && (
          <p className="text-xs text-muted-foreground mt-8">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}

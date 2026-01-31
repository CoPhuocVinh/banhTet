"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type CTASettings = {
  contact_phone: string;
  zalo_url: string;
};

const defaultSettings: CTASettings = {
  contact_phone: "0901234567",
  zalo_url: "https://zalo.me/banhtettet",
};

export function FloatingCTA() {
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState<CTASettings>(defaultSettings);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (approx 100vh)
      setIsVisible(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["contact_phone", "zalo_url"]);

      if (data && data.length > 0) {
        const loadedSettings = { ...defaultSettings };
        data.forEach((item: { key: string; value: string }) => {
          if (item.key in loadedSettings) {
            loadedSettings[item.key as keyof CTASettings] = item.value;
          }
        });
        setSettings(loadedSettings);
      }
    }

    fetchSettings();
  }, []);

  return (
    <>
      {/* Mobile bottom bar - only visible on mobile */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          >
            <div className="bg-card/95 backdrop-blur-md border-t border-border shadow-lg p-3">
              <div className="flex items-center justify-between gap-2">
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 text-xs"
                  >
                    <Phone className="h-4 w-4" />
                    Gọi ngay
                  </Button>
                </a>
                <Link href={`/${locale}/order`} className="flex-1">
                  <Button size="sm" className="w-full gap-2 text-xs">
                    <ShoppingCart className="h-4 w-4" />
                    Đặt hàng
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop floating buttons - only visible on desktop */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex flex-col gap-3 mb-3"
            >
              {/* Phone */}
              <motion.a
                href={`tel:${settings.contact_phone}`}
                className={cn(
                  "flex items-center justify-center h-12 w-12 rounded-full",
                  "bg-green-500 text-white shadow-lg",
                  "hover:bg-green-600 hover:scale-110 transition-all"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="h-5 w-5" />
              </motion.a>

              {/* Zalo */}
              <motion.a
                href={settings.zalo_url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center justify-center h-12 w-12 rounded-full",
                  "bg-blue-500 text-white shadow-lg",
                  "hover:bg-blue-600 hover:scale-110 transition-all"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="h-5 w-5" />
              </motion.a>

              {/* Order */}
              <Link href={`/${locale}/order`}>
                <motion.div
                  className={cn(
                    "flex items-center justify-center h-12 w-12 rounded-full",
                    "bg-primary text-primary-foreground shadow-lg",
                    "hover:bg-primary/90 hover:scale-110 transition-all"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart className="h-5 w-5" />
                </motion.div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center justify-center h-14 w-14 rounded-full",
            "bg-primary text-primary-foreground shadow-xl",
            "hover:bg-primary/90 transition-colors"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: isExpanded ? 45 : 0 }}
        >
          {isExpanded ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </motion.button>
      </div>
    </>
  );
}

export default FloatingCTA;

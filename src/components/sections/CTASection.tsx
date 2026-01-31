"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type CTASettings = {
  contact_phone: string;
  zalo_url: string;
};

const defaultSettings: CTASettings = {
  contact_phone: "0901234567",
  zalo_url: "https://zalo.me/banhtettet",
};

export function CTASection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const [settings, setSettings] = useState<CTASettings>(defaultSettings);

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
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-tet-red-dark text-primary-foreground relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-tet-gold/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Đặt bánh tét ngay hôm nay!
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
            Đừng để Tết đến mà thiếu bánh tét. Đặt hàng sớm để được giá tốt và
            giao hàng đúng hẹn.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href={`/${locale}/order`}>
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8 text-base gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                {t("cta")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href={`tel:${settings.contact_phone}`}>
              <Button
                size="lg"
                className="rounded-full px-8 text-base gap-2 bg-white/20 border border-white/30 text-white hover:bg-white/30"
              >
                <Phone className="h-4 w-4" />
                Gọi ngay: {settings.contact_phone}
              </Button>
            </a>
          </div>

          {/* Zalo */}
          <p className="text-primary-foreground/70 text-sm">
            Hoặc liên hệ qua{" "}
            <a
              href={settings.zalo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent hover:underline font-medium"
            >
              <MessageCircle className="h-4 w-4" />
              Zalo
            </a>{" "}
            để được tư vấn nhanh nhất
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default CTASection;

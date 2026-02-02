"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Utensils, Heart, Clock, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const statIcons = [Utensils, Heart, Clock, Users];

type AboutSettings = {
  about_section_label: string;
  about_title: string;
  about_title_highlight: string;
  about_description1: string;
  about_description2: string;
  about_image_url: string;
  about_badge_value: string;
  about_badge_label: string;
  about_stat1_value: string;
  about_stat1_label: string;
  about_stat2_value: string;
  about_stat2_label: string;
  about_stat3_value: string;
  about_stat3_label: string;
  about_stat4_value: string;
  about_stat4_label: string;
};

const defaultSettings: AboutSettings = {
  about_section_label: "Về chúng tôi",
  about_title: "Hương vị truyền thống,",
  about_title_highlight: "chất lượng hiện đại",
  about_description1:
    "Với hơn 10 năm kinh nghiệm, chúng tôi tự hào mang đến những chiếc bánh tét thơm ngon, được làm từ nguyên liệu tươi sạch và công thức gia truyền. Mỗi chiếc bánh là tâm huyết của người thợ làm bánh, gói trọn hương vị Tết Việt.",
  about_description2:
    "Từ lá chuối tươi đến nếp thơm, đậu xanh bùi béo - tất cả đều được chọn lọc kỹ càng. Chúng tôi cam kết mang đến cho bạn những chiếc bánh tét ngon nhất, an toàn nhất.",
  about_image_url: "https://cdn.efl.vn/banhTetImg/brand-story.jpg",
  about_badge_value: "10+",
  about_badge_label: "Năm kinh nghiệm",
  about_stat1_value: "8+",
  about_stat1_label: "Loại bánh",
  about_stat2_value: "1000+",
  about_stat2_label: "Khách hàng",
  about_stat3_value: "10+",
  about_stat3_label: "Năm kinh nghiệm",
  about_stat4_value: "100%",
  about_stat4_label: "Hài lòng",
};

const settingKeys = Object.keys(defaultSettings) as (keyof AboutSettings)[];

export function BrandSection() {
  const [settings, setSettings] = useState<AboutSettings>(defaultSettings);

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", settingKeys);

      if (data && data.length > 0) {
        const loadedSettings = { ...defaultSettings };
        data.forEach((item: { key: string; value: string }) => {
          if (item.key in loadedSettings) {
            loadedSettings[item.key as keyof AboutSettings] = item.value;
          }
        });
        setSettings(loadedSettings);
      }
    }

    fetchSettings();
  }, []);

  const stats = [
    { icon: statIcons[0], value: settings.about_stat1_value, label: settings.about_stat1_label },
    { icon: statIcons[1], value: settings.about_stat2_value, label: settings.about_stat2_label },
    { icon: statIcons[2], value: settings.about_stat3_value, label: settings.about_stat3_label },
    { icon: statIcons[3], value: settings.about_stat4_value, label: settings.about_stat4_label },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image side */}
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInLeft}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-tet-gold/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-tet-red/10 rounded-full blur-xl" />

              {/* Main image */}
              <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={settings.about_image_url}
                  alt="Quy trình làm bánh tét"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Floating badge - overlapping bottom right corner */}
              <motion.div
                className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 bg-card p-4 rounded-xl shadow-lg border border-border z-10"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <p className="text-3xl font-bold text-primary">
                  {settings.about_badge_value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {settings.about_badge_label}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInRight}>
              <span className="text-primary font-medium uppercase tracking-wider text-sm">
                {settings.about_section_label}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mt-2">
                {settings.about_title}{" "}
                <span className="text-primary">{settings.about_title_highlight}</span>
              </h2>
            </motion.div>

            <motion.p
              className="text-muted-foreground text-lg leading-relaxed"
              variants={fadeInRight}
            >
              {settings.about_description1}
            </motion.p>

            <motion.p
              className="text-muted-foreground leading-relaxed"
              variants={fadeInRight}
            >
              {settings.about_description2}
            </motion.p>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6"
              variants={staggerContainer}
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="text-center p-4 rounded-lg bg-card shadow-sm"
                    variants={fadeInRight}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold text-secondary">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default BrandSection;

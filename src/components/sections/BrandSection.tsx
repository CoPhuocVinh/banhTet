"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Utensils, Heart, Clock, Users } from "lucide-react";

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

const stats = [
  { icon: Utensils, value: "8+", label: "Loại bánh" },
  { icon: Heart, value: "1000+", label: "Khách hàng" },
  { icon: Clock, value: "10+", label: "Năm kinh nghiệm" },
  { icon: Users, value: "100%", label: "Hài lòng" },
];

export function BrandSection() {
  const t = useTranslations("brand");

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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://cdn.efl.vn/banhTetImg/brand-story.jpg"
                  alt="Quy trình làm bánh tét"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-6 -right-6 bg-card p-4 rounded-xl shadow-lg"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <p className="text-3xl font-bold text-primary">10+</p>
                <p className="text-sm text-muted-foreground">Năm kinh nghiệm</p>
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
                Về chúng tôi
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mt-2">
                Hương vị truyền thống,{" "}
                <span className="text-primary">chất lượng hiện đại</span>
              </h2>
            </motion.div>

            <motion.p
              className="text-muted-foreground text-lg leading-relaxed"
              variants={fadeInRight}
            >
              Với hơn 10 năm kinh nghiệm, chúng tôi tự hào mang đến những chiếc
              bánh tét thơm ngon, được làm từ nguyên liệu tươi sạch và công thức
              gia truyền. Mỗi chiếc bánh là tâm huyết của người thợ làm bánh,
              gói trọn hương vị Tết Việt.
            </motion.p>

            <motion.p
              className="text-muted-foreground leading-relaxed"
              variants={fadeInRight}
            >
              Từ lá chuối tươi đến nếp thơm, đậu xanh bùi béo - tất cả đều được
              chọn lọc kỹ càng. Chúng tôi cam kết mang đến cho bạn những chiếc
              bánh tét ngon nhất, an toàn nhất.
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

"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Leaf, Truck, Award, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Scene3D = dynamic(
  () => import("@/components/3d/Scene3D").then((mod) => mod.Scene3D),
  { ssr: false }
);

const LiXi3D = dynamic(
  () => import("@/components/3d/LiXi3D").then((mod) => mod.LiXi3D),
  { ssr: false }
);

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const featureIcons = [
  { icon: Leaf, color: "bg-tet-green/10 text-tet-green" },
  { icon: Truck, color: "bg-tet-red/10 text-tet-red" },
  { icon: Award, color: "bg-tet-gold/10 text-tet-gold" },
];

export function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-tet-gold/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-tet-red/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-tet-green/5 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* 3D Bánh Tét */}
        <motion.div
          className="h-[280px] w-[280px] sm:h-[350px] sm:w-[350px] md:h-[400px] md:w-[400px]"
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Scene3D cameraPosition={[0, 0, 4]}>
            <LiXi3D scale={1.5} />
          </Scene3D>
        </motion.div>

        {/* Title */}
        <motion.div className="space-y-4" variants={fadeInUp}>
          <h1 className="text-4xl font-bold tracking-tight text-secondary sm:text-5xl md:text-6xl lg:text-7xl">
            {t("title")}{" "}
            <span className="text-primary relative">
              {t("titleHighlight")}
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-1 bg-accent rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-muted-foreground md:text-xl">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row"
          variants={fadeInUp}
        >
          <Link href={`/${locale}/order`}>
            <Button
              size="lg"
              className="rounded-full px-8 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              {t("cta")}
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 text-base border-secondary hover:bg-secondary hover:text-secondary-foreground transition-all"
            onClick={scrollToProducts}
          >
            {t("viewProducts")}
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3"
          variants={staggerContainer}
        >
          {["natural", "delivery", "quality"].map((feature, index) => {
            const { icon: Icon, color } = featureIcons[index];
            return (
              <motion.div
                key={feature}
                className="flex flex-col items-center gap-3"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-secondary">
                  {t(`features.${feature}`)}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.button
          onClick={scrollToProducts}
          className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.button>
      </motion.div>
    </section>
  );
}

export default HeroSection;

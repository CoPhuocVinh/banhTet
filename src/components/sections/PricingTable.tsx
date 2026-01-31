"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Price tiers from seed data
const priceTiers = [
  {
    id: "normal",
    name: "Ngày thường",
    description: "Giá ưu đãi cho ngày thường",
    color: "#22C55E",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    isHighlighted: false,
  },
  {
    id: "peak",
    name: "Ngày cao điểm",
    description: "25-28 Tết (Âm lịch)",
    color: "#F59E0B",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    isHighlighted: true,
  },
  {
    id: "tet",
    name: "Ngày Tết",
    description: "29-30 Tết và Mùng 1-3",
    color: "#EF4444",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    isHighlighted: false,
  },
];

// Products with prices from seed data
const products = [
  { name: "Bánh Tét Đậu Xanh", prices: [80000, 100000, 120000] },
  { name: "Bánh Tét Thịt Mỡ", prices: [100000, 130000, 150000] },
  { name: "Bánh Tét Chuối", prices: [70000, 90000, 110000] },
  { name: "Bánh Tét Nếp Cẩm", prices: [90000, 115000, 135000] },
  { name: "Bánh Tét Chay", prices: [75000, 95000, 115000] },
  { name: "Bánh Tét Lá Dứa", prices: [85000, 105000, 125000] },
  { name: "Bánh Tét Trứng Muối", prices: [150000, 180000, 200000] },
  { name: "Bánh Tét Mini", prices: [45000, 55000, 65000] },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN").format(price);
}

export function PricingTable() {
  const t = useTranslations("pricing");

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-medium uppercase tracking-wider text-sm">
            Bảng giá
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mt-2">
            {t("title")}{" "}
            <span className="text-primary">theo ngày</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Giá bánh thay đổi theo thời điểm. Đặt sớm để được giá tốt nhất!
          </p>
        </motion.div>

        {/* Tier legend */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {priceTiers.map((tier) => (
            <TooltipProvider key={tier.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${tier.bgColor} ${tier.borderColor} border cursor-help`}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className={`text-sm font-medium ${tier.textColor}`}>
                      {tier.name}
                    </span>
                    <Info className="h-3.5 w-3.5 opacity-50" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tier.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </motion.div>

        {/* Pricing table */}
        <motion.div
          className="overflow-x-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 bg-card rounded-tl-lg border-b border-border">
                  <span className="font-semibold text-secondary">Sản phẩm</span>
                </th>
                {priceTiers.map((tier, index) => (
                  <th
                    key={tier.id}
                    className={`p-4 text-center border-b border-border ${
                      tier.isHighlighted ? tier.bgColor : "bg-card"
                    } ${index === priceTiers.length - 1 ? "rounded-tr-lg" : ""}`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className={`font-semibold ${tier.textColor}`}>
                        {tier.name}
                      </span>
                      {tier.isHighlighted && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-amber-200 text-amber-800"
                        >
                          Phổ biến
                        </Badge>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, productIndex) => (
                <motion.tr
                  key={product.name}
                  variants={fadeInUp}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td
                    className={`p-4 border-b border-border bg-card ${
                      productIndex === products.length - 1 ? "rounded-bl-lg" : ""
                    }`}
                  >
                    <span className="font-medium text-secondary">
                      {product.name}
                    </span>
                  </td>
                  {product.prices.map((price, tierIndex) => {
                    const tier = priceTiers[tierIndex];
                    return (
                      <td
                        key={tierIndex}
                        className={`p-4 text-center border-b border-border ${
                          tier.isHighlighted ? tier.bgColor : "bg-card"
                        } ${
                          productIndex === products.length - 1 &&
                          tierIndex === priceTiers.length - 1
                            ? "rounded-br-lg"
                            : ""
                        }`}
                      >
                        <span
                          className={`font-semibold ${
                            tierIndex === 0
                              ? "text-green-600"
                              : tier.textColor
                          }`}
                        >
                          {formatPrice(price)}đ
                        </span>
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Note */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Check className="h-4 w-4 inline-block mr-1 text-green-500" />
          Miễn phí giao hàng cho đơn từ 500.000đ
        </motion.p>
      </div>
    </section>
  );
}

export default PricingTable;

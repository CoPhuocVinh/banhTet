"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isPast,
  isToday,
} from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Price tier configurations
const tierConfigs: Record<
  string,
  { name: string; color: string; bgColor: string; borderColor: string }
> = {
  normal: {
    name: "Ngày thường",
    color: "#22C55E",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
  },
  peak: {
    name: "Ngày cao điểm",
    color: "#F59E0B",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
  },
  tet: {
    name: "Ngày Tết",
    color: "#EF4444",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
  },
};

// Sample date tier assignments - from seed data (Tết 2026)
// Mùng 1 Tết 2026 = 17/02/2026
// Tháng Chạp năm Ất Tỵ chỉ có 29 ngày (không có ngày 30)
const dateTierAssignments: Record<string, "normal" | "peak" | "tet"> = {
  // Peak days (23-28 Chạp)
  "2026-02-10": "peak", // 23 Chạp
  "2026-02-11": "peak", // 24 Chạp
  "2026-02-12": "peak", // 25 Chạp
  "2026-02-13": "peak", // 26 Chạp
  "2026-02-14": "peak", // 27 Chạp
  "2026-02-15": "peak", // 28 Chạp
  // Tet days (29 Chạp - Mùng 3)
  "2026-02-16": "tet", // 29 Chạp (Tất Niên - ngày cuối năm)
  "2026-02-17": "tet", // Mùng 1 Tết
  "2026-02-18": "tet", // Mùng 2
  "2026-02-19": "tet", // Mùng 3
};

// Lunar date mapping for Tết 2026
// Mùng 1 Tết 2026 = 17/02/2026
// Tháng Chạp năm Ất Tỵ chỉ có 29 ngày (không có ngày 30)
function getLunarDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;

  // Mapping for Tết 2026 period (tháng 2 dương lịch)
  if (date.getFullYear() === 2026 && month === 2) {
    // Tháng Chạp (tháng 12 âm lịch) - chỉ có 29 ngày
    if (day === 1) return "14/12";
    if (day === 2) return "15/12";
    if (day === 3) return "16/12";
    if (day === 4) return "17/12";
    if (day === 5) return "18/12";
    if (day === 6) return "19/12";
    if (day === 7) return "20/12";
    if (day === 8) return "21/12";
    if (day === 9) return "22/12";
    if (day === 10) return "23 Chạp";
    if (day === 11) return "24 Chạp";
    if (day === 12) return "25 Chạp";
    if (day === 13) return "26 Chạp";
    if (day === 14) return "27 Chạp";
    if (day === 15) return "28 Chạp";
    if (day === 16) return "29 Chạp"; // Tất Niên - ngày cuối năm
    // Tháng Giêng (tháng 1 âm lịch)
    if (day === 17) return "Mùng 1";
    if (day === 18) return "Mùng 2";
    if (day === 19) return "Mùng 3";
    if (day === 20) return "Mùng 4";
    if (day === 21) return "Mùng 5";
    if (day === 22) return "Mùng 6";
    if (day === 23) return "Mùng 7";
    if (day === 24) return "Mùng 8";
    if (day === 25) return "Mùng 9";
    if (day === 26) return "Mùng 10";
    if (day === 27) return "11/1";
    if (day === 28) return "12/1";
  }

  return `${day}/${month}`;
}

function getTierForDate(date: Date): "normal" | "peak" | "tet" | null {
  const dateStr = format(date, "yyyy-MM-dd");
  return dateTierAssignments[dateStr] || null;
}

export function ScheduleCalendar() {
  const t = useTranslations("calendar");
  const locale = useLocale();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // February 2026 for demo
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const dateLocale = locale === "vi" ? vi : enUS;

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const currentDay = day;
      const tier = getTierForDate(currentDay);
      const isCurrentMonth = isSameMonth(currentDay, monthStart);
      const isSelected = selectedDate && isSameDay(currentDay, selectedDate);
      const isPastDay = isPast(currentDay) && !isToday(currentDay);
      const lunarDate = getLunarDate(currentDay);

      days.push(
        <motion.button
          key={currentDay.toString()}
          whileHover={!isPastDay && isCurrentMonth ? { scale: 1.05 } : {}}
          whileTap={!isPastDay && isCurrentMonth ? { scale: 0.95 } : {}}
          onClick={() => {
            if (!isPastDay && isCurrentMonth) {
              setSelectedDate(currentDay);
            }
          }}
          disabled={isPastDay || !isCurrentMonth}
          className={cn(
            "relative flex flex-col items-center justify-center p-2 h-16 sm:h-20 rounded-lg transition-all",
            !isCurrentMonth && "opacity-30",
            isPastDay && "opacity-40 cursor-not-allowed",
            isCurrentMonth && !isPastDay && "hover:shadow-md cursor-pointer",
            isSelected && "ring-2 ring-primary ring-offset-2",
            tier && tierConfigs[tier].bgColor,
            tier && tierConfigs[tier].borderColor,
            tier && "border",
            !tier && isCurrentMonth && "bg-card border border-border"
          )}
        >
          <span
            className={cn(
              "text-sm sm:text-base font-semibold",
              isToday(currentDay) && "text-primary",
              tier === "tet" && "text-red-700",
              tier === "peak" && "text-amber-700"
            )}
          >
            {format(currentDay, "d")}
          </span>
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            {lunarDate}
          </span>
        </motion.button>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-1 sm:gap-2">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <section className="py-20">
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
            Lịch đặt hàng
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mt-2">
            {t("selectDate")}{" "}
            <span className="text-primary">giao hàng</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Chọn ngày nhận hàng để xem giá. Màu sắc thể hiện mức giá theo thời
            điểm.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Calendar */}
          <motion.div
            className="bg-card rounded-2xl shadow-lg p-4 sm:p-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Calendar header */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h3 className="text-lg font-semibold text-secondary">
                {format(currentMonth, "MMMM yyyy", { locale: dateLocale })}
              </h3>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="space-y-1 sm:space-y-2">{rows}</div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-border">
              {Object.entries(tierConfigs).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-4 h-4 rounded",
                      config.bgColor,
                      config.borderColor,
                      "border"
                    )}
                  />
                  <span className="text-sm text-muted-foreground">
                    {config.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Selected date info */}
            {selectedDate && (
              <motion.div
                className="mt-6 p-4 bg-muted rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    Ngày đã chọn:{" "}
                    {format(selectedDate, "dd/MM/yyyy", { locale: dateLocale })}
                  </span>
                  {getTierForDate(selectedDate) && (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        tierConfigs[getTierForDate(selectedDate)!].bgColor
                      )}
                    >
                      {tierConfigs[getTierForDate(selectedDate)!].name}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ScheduleCalendar;

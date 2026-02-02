"use client";

import { useEffect, useState } from "react";
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
import { Solar } from "lunar-typescript";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type PriceTier = {
  id: string;
  name: string;
  description: string | null;
  color: string;
};

type DateTierAssignment = {
  date: string;
  tier_id: string;
};

// Map hex color to tailwind classes
function getTierColorClasses(color: string) {
  const colorMap: Record<
    string,
    { bgColor: string; borderColor: string; textColor: string }
  > = {
    "#22C55E": {
      bgColor: "bg-green-100",
      borderColor: "border-green-300",
      textColor: "text-green-700",
    },
    "#F59E0B": {
      bgColor: "bg-amber-100",
      borderColor: "border-amber-300",
      textColor: "text-amber-700",
    },
    "#EF4444": {
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
      textColor: "text-red-700",
    },
  };

  return (
    colorMap[color.toUpperCase()] || {
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
      textColor: "text-gray-700",
    }
  );
}

// Convert solar date to Vietnamese lunar date string
function getLunarDate(date: Date, locale: string): string {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  const day = lunar.getDay();
  const month = lunar.getMonth();

  // Vietnamese special names for Tết period
  if (locale === "vi") {
    // Tháng Chạp (tháng 12 âm lịch)
    if (month === 12 && day >= 23) {
      return `${day} Chạp`;
    }
    // Tháng Giêng (tháng 1 âm lịch) - Mùng 1-10
    if (month === 1 && day <= 10) {
      return `Mùng ${day}`;
    }
  }

  return `${day}/${month}`;
}

export function ScheduleCalendar() {
  const t = useTranslations("calendar");
  const locale = useLocale();
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Start with current month, or Feb 2026 if we're before that
    const now = new Date();
    const feb2026 = new Date(2026, 1, 1);
    return now < feb2026 ? feb2026 : now;
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [dateTierAssignments, setDateTierAssignments] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);

  const dateLocale = locale === "vi" ? vi : enUS;

  // Fetch data from database
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Fetch price tiers
      const { data: tiers } = await supabase
        .from("price_tiers")
        .select("id, name, description, color")
        .order("created_at");

      // Fetch date tier assignments
      const { data: assignments } = await supabase
        .from("date_tier_assignments")
        .select("date, tier_id");

      if (tiers) {
        setPriceTiers(tiers as PriceTier[]);
      }

      if (assignments) {
        const assignmentMap: Record<string, string> = {};
        (assignments as DateTierAssignment[]).forEach((a) => {
          assignmentMap[a.date] = a.tier_id;
        });
        setDateTierAssignments(assignmentMap);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  // Get tier for a specific date
  function getTierForDate(date: Date): PriceTier | null {
    const dateStr = format(date, "yyyy-MM-dd");
    const tierId = dateTierAssignments[dateStr];
    if (!tierId) return null;
    return priceTiers.find((t) => t.id === tierId) || null;
  }

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const currentDay = day;
      const tier = getTierForDate(currentDay);
      const tierColors = tier ? getTierColorClasses(tier.color) : null;
      const isCurrentMonth = isSameMonth(currentDay, monthStart);
      const isSelected = selectedDate && isSameDay(currentDay, selectedDate);
      const isPastDay = isPast(currentDay) && !isToday(currentDay);
      const lunarDate = getLunarDate(currentDay, locale);

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
            tierColors && tierColors.bgColor,
            tierColors && tierColors.borderColor,
            tierColors && "border",
            !tierColors && isCurrentMonth && "bg-card border border-border"
          )}
        >
          <span
            className={cn(
              "text-sm sm:text-base font-semibold",
              isToday(currentDay) && "text-primary",
              tierColors && tierColors.textColor
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

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </section>
    );
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
              {weekDays.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="space-y-1 sm:space-y-2">{rows}</div>

            {/* Legend */}
            {priceTiers.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-border">
                {priceTiers.map((tier) => {
                  const colors = getTierColorClasses(tier.color);
                  return (
                    <div key={tier.id} className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-4 h-4 rounded",
                          colors.bgColor,
                          colors.borderColor,
                          "border"
                        )}
                      />
                      <span className="text-sm text-muted-foreground">
                        {tier.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

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
                        getTierColorClasses(getTierForDate(selectedDate)!.color)
                          .bgColor
                      )}
                    >
                      {getTierForDate(selectedDate)!.name}
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

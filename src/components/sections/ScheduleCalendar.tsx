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
import { ChevronLeft, ChevronRight, Info, Package } from "lucide-react";
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

type DayStats = {
  orderCount: number;
  totalItems: number;
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
  const [showStats, setShowStats] = useState(false);
  const [dayStats, setDayStats] = useState<Record<string, DayStats>>({});

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

      // Fetch setting for showing order stats
      const { data: settingData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "show_calendar_order_stats")
        .single();

      const shouldShowStats = (settingData as { value: string } | null)?.value === "true";
      setShowStats(shouldShowStats);

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

  // Fetch order stats when showStats changes or month changes
  useEffect(() => {
    async function fetchOrderStats() {
      if (!showStats) return;

      const supabase = createClient();
      const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd");
      const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd");

      // Get cancelled status ID
      const { data: cancelledStatus } = await supabase
        .from("order_statuses")
        .select("id")
        .eq("name", "Đã hủy")
        .single();

      const cancelledStatusId = (cancelledStatus as { id: string } | null)?.id;

      // Fetch orders for this month
      let query = supabase
        .from("orders")
        .select(`
          delivery_date,
          status_id,
          order_items (quantity)
        `)
        .gte("delivery_date", monthStart)
        .lte("delivery_date", monthEnd);

      if (cancelledStatusId) {
        query = query.neq("status_id", cancelledStatusId);
      }

      const { data: orders } = await query;

      // Build day stats
      const stats: Record<string, DayStats> = {};

      (orders as { delivery_date: string; order_items: { quantity: number }[] }[] | null)?.forEach((order) => {
        const date = order.delivery_date;
        if (!stats[date]) {
          stats[date] = { orderCount: 0, totalItems: 0 };
        }
        stats[date].orderCount += 1;
        stats[date].totalItems += order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      });

      setDayStats(stats);
    }

    fetchOrderStats();
  }, [showStats, currentMonth]);

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
      const dateStr = format(currentDay, "yyyy-MM-dd");
      const stats = dayStats[dateStr];

      days.push(
        <motion.button
          key={currentDay.toString()}
          whileHover={!isPastDay && isCurrentMonth ? { scale: 1.02 } : {}}
          whileTap={!isPastDay && isCurrentMonth ? { scale: 0.98 } : {}}
          onClick={() => {
            if (!isPastDay && isCurrentMonth) {
              setSelectedDate(currentDay);
            }
          }}
          disabled={isPastDay || !isCurrentMonth}
          className={cn(
            "relative flex flex-col items-center justify-start p-1.5 sm:p-2 rounded-lg transition-all",
            showStats ? "h-20 sm:h-24" : "h-16 sm:h-20",
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
              "text-sm sm:text-base font-semibold leading-tight",
              isToday(currentDay) && "text-primary",
              tierColors && tierColors.textColor
            )}
          >
            {format(currentDay, "d")}
          </span>
          <span className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight">
            {lunarDate}
          </span>
          {showStats && stats && stats.orderCount > 0 && (
            <div className="mt-auto w-full">
              <div className="flex items-center justify-center gap-0.5 text-[10px] sm:text-xs bg-primary/15 rounded px-1 py-0.5">
                <Package className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="font-medium">{stats.orderCount}</span>
              </div>
              <div className="text-[8px] sm:text-[10px] text-muted-foreground text-center">
                {stats.totalItems} bánh
              </div>
            </div>
          )}
        </motion.button>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-0.5 sm:gap-1.5">
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
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1.5 mb-1">
              {weekDays.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-1.5"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="space-y-0.5 sm:space-y-1.5">{rows}</div>

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

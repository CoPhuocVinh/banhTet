"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DayPicker } from "react-day-picker";
import { vi } from "react-day-picker/locale";
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Package, DollarSign, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type OrderSummary = {
  id: string;
  order_code: string;
  customer_name: string;
  total_amount: number;
  delivery_date: string;
  order_statuses: { name: string; color: string } | null;
};

type DaySummary = {
  date: string;
  orderCount: number;
  totalAmount: number;
  totalItems: number;
  orders: OrderSummary[];
  tier: string | null;
  tierColor: string | null;
};

type DateTierAssignment = {
  date: string;
  price_tiers: { name: string; color: string } | null;
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daySummaries, setDaySummaries] = useState<Record<string, DaySummary>>({});
  const [selectedDay, setSelectedDay] = useState<DaySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthData();
  }, [currentMonth]);

  async function fetchMonthData() {
    setLoading(true);
    const supabase = createClient();

    const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd");

    // Fetch orders for this month
    const { data: orders } = await supabase
      .from("orders")
      .select(`
        id,
        order_code,
        customer_name,
        total_amount,
        delivery_date,
        order_statuses (
          name,
          color
        ),
        order_items (
          quantity
        )
      `)
      .gte("delivery_date", monthStart)
      .lte("delivery_date", monthEnd)
      .order("created_at", { ascending: false });

    // Fetch date tier assignments for tier info
    const { data: dateAssignments } = await supabase
      .from("date_tier_assignments")
      .select(`
        date,
        price_tiers (
          name,
          color
        )
      `)
      .gte("date", monthStart)
      .lte("date", monthEnd);

    // Build day summaries
    const summaries: Record<string, DaySummary> = {};

    // Initialize with date tier assignments
    (dateAssignments as DateTierAssignment[] | null)?.forEach((assignment) => {
      summaries[assignment.date] = {
        date: assignment.date,
        orderCount: 0,
        totalAmount: 0,
        totalItems: 0,
        orders: [],
        tier: assignment.price_tiers?.name || null,
        tierColor: assignment.price_tiers?.color || null,
      };
    });

    // Add orders
    (orders as (OrderSummary & { order_items: { quantity: number }[] })[] | null)?.forEach((order) => {
      const date = order.delivery_date;
      if (!summaries[date]) {
        summaries[date] = {
          date,
          orderCount: 0,
          totalAmount: 0,
          totalItems: 0,
          orders: [],
          tier: null,
          tierColor: null,
        };
      }
      summaries[date].orderCount += 1;
      summaries[date].totalAmount += order.total_amount;
      summaries[date].totalItems += order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      summaries[date].orders.push({
        id: order.id,
        order_code: order.order_code,
        customer_name: order.customer_name,
        total_amount: order.total_amount,
        delivery_date: order.delivery_date,
        order_statuses: order.order_statuses,
      });
    });

    setDaySummaries(summaries);
    setLoading(false);
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  function handleDayClick(date: Date) {
    const dateStr = format(date, "yyyy-MM-dd");
    const summary = daySummaries[dateStr];
    if (summary && summary.orderCount > 0) {
      setSelectedDay(summary);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Lịch đơn hàng</h1>
          <p className="text-muted-foreground">
            Xem đơn hàng theo ngày giao
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium min-w-[150px] text-center">
            {format(currentMonth, "MMMM yyyy", { locale: vi })}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span>Ngày thường</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500" />
          <span>Ngày cao điểm</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span>Ngày Tết</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-card rounded-xl border border-border p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <DayPicker
            mode="single"
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={vi}
            showOutsideDays={false}
            classNames={{
              root: "w-full",
              months: "w-full",
              month: "w-full",
              month_caption: "hidden",
              nav: "hidden",
              month_grid: "w-full border-collapse",
              weekdays: "flex w-full",
              weekday: "flex-1 text-center text-sm font-medium text-muted-foreground py-2",
              week: "flex w-full",
              day: "flex-1 aspect-square p-1",
              day_button: "w-full h-full rounded-lg hover:bg-muted transition-colors relative flex flex-col items-center justify-start p-2 text-left",
              selected: "bg-primary text-primary-foreground",
              today: "ring-2 ring-primary ring-offset-2",
              outside: "text-muted-foreground opacity-50",
              disabled: "text-muted-foreground opacity-50",
            }}
            components={{
              DayButton: ({ day, ...props }) => {
                const dateStr = format(day.date, "yyyy-MM-dd");
                const summary = daySummaries[dateStr];
                const tierColor = summary?.tierColor;

                return (
                  <button
                    {...props}
                    onClick={() => handleDayClick(day.date)}
                    className="w-full h-full rounded-lg hover:ring-2 hover:ring-primary transition-all relative flex flex-col items-center justify-start p-2"
                    style={{
                      backgroundColor: tierColor ? `${tierColor}15` : undefined,
                      borderLeft: tierColor ? `3px solid ${tierColor}` : undefined,
                    }}
                  >
                    <span className="text-sm font-medium">{format(day.date, "d")}</span>
                    {summary && summary.orderCount > 0 && (
                      <div className="mt-1 space-y-1 w-full">
                        <div className="flex items-center justify-center gap-1 text-xs bg-primary/10 rounded px-1 py-0.5">
                          <Package className="h-3 w-3" />
                          <span>{summary.orderCount}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground text-center truncate">
                          {summary.totalItems} bánh
                        </div>
                      </div>
                    )}
                  </button>
                );
              },
            }}
          />
        )}
      </div>

      {/* Selected Day Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedDay(null)}>
          <div
            className="bg-card rounded-xl border border-border p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-secondary">
                Đơn hàng ngày {format(new Date(selectedDay.date), "dd/MM/yyyy")}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedDay(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">{selectedDay.orderCount}</p>
                <p className="text-xs text-muted-foreground">Đơn hàng</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{selectedDay.totalItems}</p>
                <p className="text-xs text-muted-foreground">Số bánh</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-amber-600">{formatCurrency(selectedDay.totalAmount)}</p>
                <p className="text-xs text-muted-foreground">Doanh thu</p>
              </div>
            </div>

            {/* Order List */}
            <div className="space-y-3">
              {selectedDay.orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary">{order.order_code}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                      {order.order_statuses && (
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: `${order.order_statuses.color}20`,
                            color: order.order_statuses.color,
                          }}
                        >
                          {order.order_statuses.name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

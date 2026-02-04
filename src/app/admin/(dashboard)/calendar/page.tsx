"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DayPicker } from "react-day-picker";
import { vi } from "react-day-picker/locale";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  X,
  Plus,
  Loader2,
  FileSpreadsheet,
  Eye,
  EyeOff,
} from "lucide-react";
import { Solar } from "lunar-typescript";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { toast } from "sonner";
import { exportOrdersToExcel } from "@/lib/export-orders";
import { Switch } from "@/components/ui/switch";

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

type Product = {
  id: string;
  name: string;
  is_available: boolean;
  prices: Record<string, number>; // tier_id -> price
  default_price: number;
};

type DateTierMap = Record<string, string>; // date -> tier_id

type OrderStatus = {
  id: string;
  name: string;
  color: string;
};

// Get lunar date string
function getLunarDate(date: Date): string {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  const day = lunar.getDay();
  const month = lunar.getMonth();

  // Vietnamese special names for Tết period
  if (month === 12 && day >= 23) {
    return `${day} Chạp`;
  }
  if (month === 1 && day <= 10) {
    return `Mùng ${day}`;
  }

  return `${day}/${month}`;
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daySummaries, setDaySummaries] = useState<Record<string, DaySummary>>(
    {}
  );
  const [selectedDay, setSelectedDay] = useState<{
    date: string;
    summary: DaySummary | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Create order form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [dateTierMap, setDateTierMap] = useState<DateTierMap>({});
  const [creating, setCreating] = useState(false);

  // Export state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportRange, setExportRange] = useState({
    start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    delivery_address: "",
    note: "",
    status_id: "",
    items: [{ product_id: "", quantity: 1, unit_price: 0 }],
  });

  // Show order stats on homepage toggle
  const [showStatsOnHomepage, setShowStatsOnHomepage] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);

  useEffect(() => {
    fetchMonthData();
    fetchFormData();
    fetchHomepageToggle();
  }, [currentMonth]);

  async function fetchHomepageToggle() {
    const supabase = createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "show_calendar_order_stats")
      .single();

    if (data) {
      setShowStatsOnHomepage((data as { value: string }).value === "true");
    }
  }

  async function handleToggleHomepageStats(checked: boolean) {
    setSavingToggle(true);
    const supabase = createClient();

    try {
      // Try to update first
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("key", "show_calendar_order_stats")
        .single();

      if (existing) {
        await supabase
          .from("site_settings")
          .update({ value: checked ? "true" : "false" } as never)
          .eq("key", "show_calendar_order_stats");
      } else {
        await supabase
          .from("site_settings")
          .insert({ key: "show_calendar_order_stats", value: checked ? "true" : "false" } as never);
      }

      setShowStatsOnHomepage(checked);
      toast.success(checked ? "Đã bật hiển thị số lượng đơn trên trang chủ" : "Đã tắt hiển thị số lượng đơn trên trang chủ");
    } catch (error) {
      console.error("Error saving toggle:", error);
      toast.error("Có lỗi khi lưu cài đặt");
    } finally {
      setSavingToggle(false);
    }
  }

  async function fetchFormData() {
    const supabase = createClient();

    const [productsRes, statusesRes, tiersRes, dateTiersRes] = await Promise.all([
      supabase
        .from("products")
        .select("id, name, is_available, product_tier_prices(price, tier_id)")
        .eq("is_available", true)
        .order("display_order"),
      supabase.from("order_statuses").select("id, name, color").order("display_order"),
      supabase.from("price_tiers").select("id").order("created_at").limit(1),
      supabase.from("date_tier_assignments").select("date, tier_id"),
    ]);

    // Build date -> tier_id mapping
    if (dateTiersRes.data) {
      const tierMap: DateTierMap = {};
      (dateTiersRes.data as { date: string; tier_id: string }[]).forEach((dt) => {
        tierMap[dt.date] = dt.tier_id;
      });
      setDateTierMap(tierMap);
    }

    if (productsRes.data) {
      // Get first tier id for default pricing
      const firstTierId = (tiersRes.data as { id: string }[] | null)?.[0]?.id;

      const productsWithPrice = (productsRes.data as {
        id: string;
        name: string;
        is_available: boolean;
        product_tier_prices: { price: number; tier_id: string }[];
      }[]).map((p) => {
        // Build prices map for all tiers
        const prices: Record<string, number> = {};
        p.product_tier_prices?.forEach((tp) => {
          prices[tp.tier_id] = tp.price;
        });

        // Find price for first tier, or use first available price
        const tierPrice = p.product_tier_prices?.find((tp) => tp.tier_id === firstTierId);
        const defaultPrice = tierPrice?.price || p.product_tier_prices?.[0]?.price || 0;

        return {
          id: p.id,
          name: p.name,
          is_available: p.is_available,
          prices,
          default_price: defaultPrice,
        };
      });
      setProducts(productsWithPrice);
    }
    if (statusesRes.data) {
      const statuses = statusesRes.data as OrderStatus[];
      setOrderStatuses(statuses);
      // Set default status to first one
      if (statuses.length > 0 && !formData.status_id) {
        setFormData((prev) => ({ ...prev, status_id: statuses[0].id }));
      }
    }
  }

  async function fetchMonthData() {
    setLoading(true);
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
    const { data: orders } = await supabase
      .from("orders")
      .select(
        `
        id,
        order_code,
        customer_name,
        total_amount,
        delivery_date,
        status_id,
        order_statuses (
          name,
          color
        ),
        order_items (
          quantity
        )
      `
      )
      .gte("delivery_date", monthStart)
      .lte("delivery_date", monthEnd)
      .order("created_at", { ascending: false });

    // Fetch date tier assignments for tier info
    const { data: dateAssignments } = await supabase
      .from("date_tier_assignments")
      .select(
        `
        date,
        price_tiers (
          name,
          color
        )
      `
      )
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
    (
      orders as
        | (OrderSummary & { status_id: string; order_items: { quantity: number }[] })[]
        | null
    )?.forEach((order) => {
      const date = order.delivery_date;
      const isCancelled = cancelledStatusId && order.status_id === cancelledStatusId;

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

      // Skip cancelled orders completely
      if (isCancelled) return;

      summaries[date].orderCount += 1;
      summaries[date].totalAmount += order.total_amount;
      summaries[date].totalItems +=
        order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

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
    const summary = daySummaries[dateStr] || null;
    setSelectedDay({ date: dateStr, summary });
    setShowCreateForm(false);
    // Reset form with new delivery date
    setFormData({
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      delivery_address: "",
      note: "",
      status_id: orderStatuses[0]?.id || "",
      items: [{ product_id: "", quantity: 1, unit_price: 0 }],
    });
  }

  function generateOrderCode() {
    const now = new Date();
    const dateStr = format(now, "yyMMdd");
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BT${dateStr}${random}`;
  }

  async function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDay) return;

    // Filter valid items
    const validItems = formData.items.filter(
      (item) => item.product_id && item.quantity > 0
    );
    if (validItems.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 sản phẩm");
      return;
    }

    setCreating(true);
    const supabase = createClient();

    try {
      // Calculate total
      const totalAmount = validItems.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
      );

      // Create order
      const orderData = {
        order_code: generateOrderCode(),
        customer_name: formData.customer_name || "Khách lẻ",
        customer_phone: formData.customer_phone || "N/A",
        customer_email: formData.customer_email || null,
        delivery_address: formData.delivery_address || "N/A",
        delivery_date: selectedDay.date,
        note: formData.note || null,
        status_id: formData.status_id,
        total_amount: totalAmount,
      };
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData as never)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = validItems.map((item) => ({
        order_id: (order as { id: string }).id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems as never);

      if (itemsError) throw itemsError;

      toast.success("Tạo đơn hàng thành công!");
      setShowCreateForm(false);
      setSelectedDay(null);
      fetchMonthData();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng");
    } finally {
      setCreating(false);
    }
  }

  function addItem() {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: "", quantity: 1, unit_price: 0 }],
    }));
  }

  function removeItem(index: number) {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  // Get price for product based on selected date's tier
  function getProductPrice(product: Product): number {
    if (!selectedDay) return product.default_price;

    const tierId = dateTierMap[selectedDay.date];
    if (tierId && product.prices[tierId]) {
      return product.prices[tierId];
    }

    return product.default_price;
  }

  function updateItem(
    index: number,
    field: "product_id" | "quantity" | "unit_price",
    value: string | number
  ) {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i !== index) return item;

        // If product is selected, auto-fill the price based on date tier
        if (field === "product_id") {
          const product = products.find((p) => p.id === value);
          const price = product ? getProductPrice(product) : 0;
          return {
            ...item,
            product_id: value as string,
            unit_price: price,
          };
        }

        return { ...item, [field]: value };
      }),
    }));
  }

  async function handleExportDay(date: string) {
    const supabase = createClient();

    try {
      const { data: cancelledStatus } = await supabase
        .from("order_statuses")
        .select("id")
        .eq("name", "Đã hủy")
        .single();

      const cancelledStatusId = (cancelledStatus as { id: string } | null)?.id;

      let query = supabase
        .from("orders")
        .select(
          `
          order_code,
          customer_name,
          customer_phone,
          delivery_date,
          delivery_address,
          total_amount,
          note,
          status_id,
          order_statuses (name),
          order_items (
            quantity,
            unit_price,
            products (name)
          )
        `
        )
        .eq("delivery_date", date)
        .order("created_at");

      if (cancelledStatusId) {
        query = query.neq("status_id", cancelledStatusId);
      }

      const { data: orders, error } = await query;

      if (error) throw error;

      if (!orders || orders.length === 0) {
        toast.error("Không có đơn hàng nào cho ngày này");
        return;
      }

      exportOrdersToExcel(
        orders as Parameters<typeof exportOrdersToExcel>[0],
        `don-hang-${date}`
      );

      toast.success(`Đã xuất ${orders.length} đơn hàng`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Có lỗi khi xuất file");
    }
  }

  async function handleExport() {
    setExportLoading(true);
    const supabase = createClient();

    try {
      // Get cancelled status ID
      const { data: cancelledStatus } = await supabase
        .from("order_statuses")
        .select("id")
        .eq("name", "Đã hủy")
        .single();

      const cancelledStatusId = (cancelledStatus as { id: string } | null)?.id;

      // Fetch orders for export (exclude cancelled)
      let query = supabase
        .from("orders")
        .select(
          `
          order_code,
          customer_name,
          customer_phone,
          delivery_date,
          delivery_address,
          total_amount,
          note,
          status_id,
          order_statuses (name),
          order_items (
            quantity,
            unit_price,
            products (name)
          )
        `
        )
        .gte("delivery_date", exportRange.start)
        .lte("delivery_date", exportRange.end)
        .order("delivery_date");

      if (cancelledStatusId) {
        query = query.neq("status_id", cancelledStatusId);
      }

      const { data: orders, error } = await query;

      if (error) throw error;

      if (!orders || orders.length === 0) {
        toast.error("Không có đơn hàng nào trong khoảng thời gian này");
        return;
      }

      // Export to Excel
      exportOrdersToExcel(
        orders as Parameters<typeof exportOrdersToExcel>[0],
        `don-hang-${exportRange.start}-to-${exportRange.end}`
      );

      toast.success(`Đã xuất ${orders.length} đơn hàng`);
      setShowExportModal(false);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Có lỗi khi xuất file");
    } finally {
      setExportLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Lịch đơn hàng</h1>
          <p className="text-muted-foreground">Xem đơn hàng theo ngày giao</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-2 px-3 py-2 bg-muted rounded-lg">
            <label
              htmlFor="show-stats-toggle"
              className="text-sm text-muted-foreground cursor-pointer flex items-center gap-2"
            >
              {showStatsOnHomepage ? (
                <Eye className="h-4 w-4 text-primary" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              Hiện số đơn (Trang chủ)
            </label>
            <Switch
              id="show-stats-toggle"
              checked={showStatsOnHomepage}
              onCheckedChange={handleToggleHomepageStats}
              disabled={savingToggle}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
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
              weekday:
                "flex-1 text-center text-sm font-medium text-muted-foreground py-2",
              week: "flex w-full",
              day: "flex-1 aspect-square p-1",
              day_button:
                "w-full h-full rounded-lg hover:bg-muted transition-colors relative flex flex-col items-center justify-start p-2 text-left",
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
                const lunarDate = getLunarDate(day.date);

                return (
                  <button
                    {...props}
                    onClick={() => handleDayClick(day.date)}
                    className="w-full h-full rounded-lg hover:ring-2 hover:ring-primary transition-all relative flex flex-col items-center justify-start p-2"
                    style={{
                      backgroundColor: tierColor ? `${tierColor}15` : undefined,
                      borderLeft: tierColor
                        ? `3px solid ${tierColor}`
                        : undefined,
                    }}
                  >
                    <span className="text-sm font-medium">
                      {format(day.date, "d")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {lunarDate}
                    </span>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="bg-card rounded-xl border border-border p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-secondary">
                Ngày {format(new Date(selectedDay.date), "dd/MM/yyyy")} (
                {getLunarDate(new Date(selectedDay.date))})
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDay(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {!showCreateForm ? (
              <>
                {/* Summary Stats */}
                {selectedDay.summary && selectedDay.summary.orderCount > 0 && (
                  <>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-muted rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-primary">
                          {selectedDay.summary.orderCount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Đơn hàng
                        </p>
                      </div>
                      <div className="bg-muted rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {selectedDay.summary.totalItems}
                        </p>
                        <p className="text-xs text-muted-foreground">Số bánh</p>
                      </div>
                      <div className="bg-muted rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-amber-600">
                          {formatCurrency(selectedDay.summary.totalAmount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Doanh thu
                        </p>
                      </div>
                    </div>

                    {/* Order List */}
                    <div className="space-y-3 mb-6">
                      {selectedDay.summary.orders.map((order) => (
                        <Link
                          key={order.id}
                          href={`/admin/orders/${order.id}`}
                          className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-secondary">
                                {order.order_code}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.customer_name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatCurrency(order.total_amount)}
                              </p>
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
                  </>
                )}

                {(!selectedDay.summary ||
                  selectedDay.summary.orderCount === 0) && (
                  <p className="text-center text-muted-foreground py-8">
                    Chưa có đơn hàng nào cho ngày này
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {selectedDay.summary && selectedDay.summary.orderCount > 0 && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleExportDay(selectedDay.date)}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Xuất Excel
                    </Button>
                  )}
                  <Button
                    className="flex-1"
                    onClick={() => setShowCreateForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo đơn hàng mới
                  </Button>
                </div>
              </>
            ) : (
              /* Create Order Form */
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">Tên khách hàng</Label>
                    <Input
                      id="customer_name"
                      placeholder="Để trống = Khách lẻ"
                      value={formData.customer_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customer_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">Số điện thoại</Label>
                    <Input
                      id="customer_phone"
                      placeholder="Có thể bỏ trống"
                      value={formData.customer_phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customer_phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery_address">Địa chỉ giao hàng</Label>
                  <Input
                    id="delivery_address"
                    placeholder="Có thể bỏ trống"
                    value={formData.delivery_address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        delivery_address: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status_id">Trạng thái</Label>
                  <Select
                    value={formData.status_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status_id: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map((status) => (
                        <SelectItem key={status.id} value={status.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: status.color }}
                            />
                            {status.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Input
                    id="note"
                    placeholder="Ghi chú đơn hàng"
                    value={formData.note}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, note: e.target.value }))
                    }
                  />
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Sản phẩm</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addItem}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Thêm
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {formData.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                      >
                        <Select
                          value={item.product_id}
                          onValueChange={(value) =>
                            updateItem(index, "product_id", value)
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Chọn sản phẩm" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min="1"
                          className="w-20"
                          placeholder="SL"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              parseInt(e.target.value) || 1
                            )
                          }
                        />
                        <Input
                          type="number"
                          min="0"
                          className="w-28"
                          placeholder="Giá"
                          value={item.unit_price || ""}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "unit_price",
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                        {formData.items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="text-right font-medium">
                    Tổng:{" "}
                    {formatCurrency(
                      formData.items.reduce(
                        (sum, item) => sum + item.unit_price * item.quantity,
                        0
                      )
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" className="flex-1" disabled={creating}>
                    {creating && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Tạo đơn hàng
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="bg-card rounded-xl border border-border p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-secondary">
                Xuất danh sách đơn hàng
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowExportModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Từ ngày</Label>
                  <Input
                    type="date"
                    value={exportRange.start}
                    onChange={(e) =>
                      setExportRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Đến ngày</Label>
                  <Input
                    type="date"
                    value={exportRange.end}
                    onChange={(e) =>
                      setExportRange((prev) => ({
                        ...prev,
                        end: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const now = new Date();
                    setExportRange({
                      start: format(startOfMonth(now), "yyyy-MM-dd"),
                      end: format(endOfMonth(now), "yyyy-MM-dd"),
                    });
                  }}
                >
                  Tháng này
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setExportRange({
                      start: format(startOfMonth(currentMonth), "yyyy-MM-dd"),
                      end: format(endOfMonth(currentMonth), "yyyy-MM-dd"),
                    });
                  }}
                >
                  Tháng đang xem
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Đơn hàng đã hủy sẽ không được xuất
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowExportModal(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleExport}
                  disabled={exportLoading}
                >
                  {exportLoading && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Xuất Excel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

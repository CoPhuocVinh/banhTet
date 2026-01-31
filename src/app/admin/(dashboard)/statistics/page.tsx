"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DateRange = {
  start: string;
  end: string;
};

type Stats = {
  totalRevenue: number;
  totalOrders: number;
  totalItems: number;
  avgOrderValue: number;
};

type DailyRevenue = {
  date: string;
  revenue: number;
  orders: number;
};

type TopProduct = {
  name: string;
  quantity: number;
  revenue: number;
};

export default function StatisticsPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end: today,
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalItems: 0,
    avgOrderValue: 0,
  });
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  async function fetchStats() {
    setLoading(true);
    const supabase = createClient();

    // Fetch orders in date range
    const { data: orders } = await supabase
      .from("orders")
      .select(
        `
        id,
        total_amount,
        created_at,
        order_items (
          quantity,
          unit_price,
          products (name)
        )
      `
      )
      .gte("created_at", `${dateRange.start}T00:00:00`)
      .lte("created_at", `${dateRange.end}T23:59:59`);

    type OrderData = {
      id: string;
      total_amount: number;
      created_at: string;
      order_items: {
        quantity: number;
        unit_price: number;
        products: { name: string } | null;
      }[];
    };

    const orderList = (orders as OrderData[]) || [];

    // Calculate stats
    const totalRevenue = orderList.reduce(
      (sum, o) => sum + (o.total_amount || 0),
      0
    );
    const totalOrders = orderList.length;
    const totalItems = orderList.reduce(
      (sum, o) =>
        sum + o.order_items.reduce((s, i) => s + (i.quantity || 0), 0),
      0
    );
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    setStats({
      totalRevenue,
      totalOrders,
      totalItems,
      avgOrderValue,
    });

    // Calculate daily revenue
    const dailyMap: Record<string, { revenue: number; orders: number }> = {};

    // Initialize all days in range
    const days = eachDayOfInterval({
      start: new Date(dateRange.start),
      end: new Date(dateRange.end),
    });
    days.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      dailyMap[dateStr] = { revenue: 0, orders: 0 };
    });

    // Fill in actual data
    orderList.forEach((order) => {
      const dateStr = format(new Date(order.created_at), "yyyy-MM-dd");
      if (dailyMap[dateStr]) {
        dailyMap[dateStr].revenue += order.total_amount || 0;
        dailyMap[dateStr].orders += 1;
      }
    });

    const dailyData = Object.entries(dailyMap)
      .map(([date, data]) => ({
        date: format(new Date(date), "dd/MM", { locale: vi }),
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort(
        (a, b) =>
          new Date(a.date.split("/").reverse().join("-")).getTime() -
          new Date(b.date.split("/").reverse().join("-")).getTime()
      );

    setDailyRevenue(dailyData);

    // Calculate top products
    const productMap: Record<string, { quantity: number; revenue: number }> = {};
    orderList.forEach((order) => {
      order.order_items.forEach((item) => {
        const name = item.products?.name || "Unknown";
        if (!productMap[name]) {
          productMap[name] = { quantity: 0, revenue: 0 };
        }
        productMap[name].quantity += item.quantity || 0;
        productMap[name].revenue += (item.quantity || 0) * (item.unit_price || 0);
      });
    });

    const topProductsData = Object.entries(productMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    setTopProducts(topProductsData);
    setLoading(false);
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  function setPresetRange(preset: "today" | "7days" | "30days" | "month") {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (preset) {
      case "today":
        start = now;
        break;
      case "7days":
        start = subDays(now, 7);
        break;
      case "30days":
        start = subDays(now, 30);
        break;
      case "month":
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
    }

    setDateRange({
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
    });
  }

  const statCards = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Tổng đơn hàng",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Tổng số bánh",
      value: stats.totalItems.toString(),
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Giá trị đơn TB",
      value: formatCurrency(stats.avgOrderValue),
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Thống kê</h1>
          <p className="text-muted-foreground">
            Phân tích doanh thu và đơn hàng
          </p>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPresetRange("today")}
            >
              Hôm nay
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPresetRange("7days")}
            >
              7 ngày
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPresetRange("30days")}
            >
              30 ngày
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPresetRange("month")}
            >
              Tháng này
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Từ ngày</Label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="w-[140px]"
                />
              </div>
              <span className="text-muted-foreground mt-6">-</span>
              <div className="space-y-1">
                <Label className="text-xs">Đến ngày</Label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="w-[140px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-xl font-bold text-secondary">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Revenue Chart */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">
              Doanh thu theo ngày
            </h2>
            <div className="h-[300px]">
              {dailyRevenue.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(1)}M`
                      }
                    />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(Number(value) || 0),
                        "Doanh thu",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Không có dữ liệu trong khoảng thời gian này
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">
              Top sản phẩm bán chạy
            </h2>
            <div className="h-[300px]">
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      width={120}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "quantity"
                          ? `${Number(value) || 0} cái`
                          : formatCurrency(Number(value) || 0),
                        name === "quantity" ? "Số lượng" : "Doanh thu",
                      ]}
                    />
                    <Bar dataKey="quantity" fill="#8b5cf6" name="quantity" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Không có dữ liệu trong khoảng thời gian này
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

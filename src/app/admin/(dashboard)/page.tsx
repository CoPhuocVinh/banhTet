import { createClient } from "@/lib/supabase/server";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  Truck,
  TrendingUp,
  Package,
} from "lucide-react";
import Link from "next/link";

async function getStats() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // Fetch order statuses by name to get their IDs dynamically
  const { data: statuses } = await supabase
    .from("order_statuses")
    .select("id, name")
    .in("name", ["Chờ xác nhận", "Đang giao", "Đã hủy"]);

  const statusMap = (statuses as { id: string; name: string }[] | null)?.reduce(
    (acc, s) => ({ ...acc, [s.name]: s.id }),
    {} as Record<string, string>
  ) || {};

  const cancelledStatusId = statusMap["Đã hủy"];

  // Get today's orders count (exclude cancelled)
  let todayOrdersQuery = supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  if (cancelledStatusId) {
    todayOrdersQuery = todayOrdersQuery.neq("status_id", cancelledStatusId);
  }

  const { count: todayOrders } = await todayOrdersQuery;

  // Get today's revenue (exclude cancelled orders)
  let revenueQuery = supabase
    .from("orders")
    .select("total_amount")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  if (cancelledStatusId) {
    revenueQuery = revenueQuery.neq("status_id", cancelledStatusId);
  }

  const { data: revenueData } = await revenueQuery;

  const todayRevenue =
    (revenueData as { total_amount: number }[] | null)?.reduce(
      (sum, order) => sum + (order.total_amount || 0),
      0
    ) || 0;

  // Get pending orders (chờ xác nhận)
  const { count: pendingOrders } = statusMap["Chờ xác nhận"]
    ? await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status_id", statusMap["Chờ xác nhận"])
    : { count: 0 };

  // Get delivering orders (đang giao)
  const { count: deliveringOrders } = statusMap["Đang giao"]
    ? await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status_id", statusMap["Đang giao"])
    : { count: 0 };

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_code,
      customer_name,
      customer_phone,
      total_amount,
      delivery_date,
      created_at,
      order_statuses (
        name,
        color
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  type RecentOrder = {
    id: string;
    order_code: string;
    customer_name: string;
    customer_phone: string;
    total_amount: number;
    delivery_date: string;
    created_at: string;
    order_statuses: { name: string; color: string } | null;
  };

  return {
    todayOrders: todayOrders || 0,
    todayRevenue,
    pendingOrders: pendingOrders || 0,
    deliveringOrders: deliveringOrders || 0,
    recentOrders: (recentOrders as RecentOrder[] | null) || [],
  };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const statCards = [
    {
      title: "Đơn hôm nay",
      value: stats.todayOrders,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Doanh thu hôm nay",
      value: formatCurrency(stats.todayRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Chờ xác nhận",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Đang giao",
      value: stats.deliveringOrders,
      icon: Truck,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
        <p className="text-muted-foreground">
          Chào mừng trở lại! Đây là tổng quan hôm nay.
        </p>
      </div>

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
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-secondary">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/orders?status=pending"
          className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-secondary">
                Xem đơn chờ xác nhận
              </p>
              <p className="text-sm text-muted-foreground">
                {stats.pendingOrders} đơn cần xử lý
              </p>
            </div>
            <TrendingUp className="ml-auto h-5 w-5 text-muted-foreground" />
          </div>
        </Link>

        <Link
          href="/admin/calendar"
          className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-secondary">Xem lịch đặt hàng</p>
              <p className="text-sm text-muted-foreground">
                Quản lý đơn theo ngày giao
              </p>
            </div>
            <TrendingUp className="ml-auto h-5 w-5 text-muted-foreground" />
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-secondary">Đơn hàng gần đây</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-primary hover:underline"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="divide-y divide-border">
          {stats.recentOrders.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              Chưa có đơn hàng nào
            </div>
          ) : (
            stats.recentOrders.map((order) => {
              const status = order.order_statuses as {
                name: string;
                color: string;
              } | null;
              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-secondary">
                        {order.order_code}
                      </span>
                      {status && (
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${status.color}20`,
                            color: status.color,
                          }}
                        >
                          {status.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.customer_name} - {order.customer_phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-secondary">
                      {formatCurrency(order.total_amount || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Giao: {formatDate(order.delivery_date)}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

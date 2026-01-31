import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Search, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Order = {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  delivery_date: string;
  total_amount: number;
  created_at: string;
  order_statuses: { id: string; name: string; color: string } | null;
};

async function getOrders(searchParams: {
  search?: string;
  status?: string;
  page?: string;
}) {
  const supabase = await createClient();
  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select(
      `
      id,
      order_code,
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      delivery_date,
      total_amount,
      created_at,
      order_statuses (
        id,
        name,
        color
      )
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // Search filter
  if (searchParams.search) {
    query = query.or(
      `order_code.ilike.%${searchParams.search}%,customer_name.ilike.%${searchParams.search}%,customer_phone.ilike.%${searchParams.search}%`
    );
  }

  // Status filter
  if (searchParams.status) {
    query = query.eq("status_id", searchParams.status);
  }

  const { data: orders, count } = await query;

  // Get all statuses for filter
  const { data: statuses } = await supabase
    .from("order_statuses")
    .select("id, name, color")
    .order("display_order");

  return {
    orders: (orders as Order[] | null) || [],
    statuses: (statuses as { id: string; name: string; color: string }[]) || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
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

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("vi-VN");
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { orders, statuses, total, page, totalPages } = await getOrders(params);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Đơn hàng</h1>
          <p className="text-muted-foreground">
            Tổng cộng {total} đơn hàng
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Tìm theo mã đơn, tên, SĐT..."
              defaultValue={params.search}
              className="pl-10"
            />
          </div>
        </form>

        <div className="flex gap-2 flex-wrap">
          <Link href="/admin/orders">
            <Button
              variant={!params.status ? "default" : "outline"}
              size="sm"
            >
              Tất cả
            </Button>
          </Link>
          {statuses.map((status) => (
            <Link key={status.id} href={`/admin/orders?status=${status.id}`}>
              <Button
                variant={params.status === status.id ? "default" : "outline"}
                size="sm"
                style={
                  params.status === status.id
                    ? { backgroundColor: status.color }
                    : {}
                }
              >
                {status.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Mã đơn
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Khách hàng
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Ngày giao
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Tổng tiền
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">

                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <span className="font-medium text-secondary">
                        {order.order_code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-secondary">
                          {order.customer_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.customer_phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(order.delivery_date)}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-4 py-3">
                      {order.order_statuses && (
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${order.order_statuses.color}20`,
                            color: order.order_statuses.color,
                          }}
                        >
                          {order.order_statuses.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDateTime(order.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Trang {page} / {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/orders?page=${page - 1}${
                    params.status ? `&status=${params.status}` : ""
                  }${params.search ? `&search=${params.search}` : ""}`}
                >
                  <Button variant="outline" size="sm">
                    Trước
                  </Button>
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/orders?page=${page + 1}${
                    params.status ? `&status=${params.status}` : ""
                  }${params.search ? `&search=${params.search}` : ""}`}
                >
                  <Button variant="outline" size="sm">
                    Sau
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Copy,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusUpdater } from "./OrderStatusUpdater";

type OrderItem = {
  id: string;
  quantity: number;
  unit_price: number;
  products: {
    name: string;
    slug: string;
  } | null;
};

type Order = {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  delivery_date: string;
  note: string | null;
  total_amount: number;
  created_at: string;
  status_id: string;
  order_statuses: { id: string; name: string; color: string } | null;
  order_items: OrderItem[];
};

async function getOrder(id: string) {
  const supabase = await createClient();

  const { data: order } = await supabase
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
      note,
      total_amount,
      created_at,
      status_id,
      order_statuses (
        id,
        name,
        color
      ),
      order_items (
        id,
        quantity,
        unit_price,
        products (
          name,
          slug
        )
      )
    `
    )
    .eq("id", id)
    .single();

  // Get all statuses for dropdown
  const { data: statuses } = await supabase
    .from("order_statuses")
    .select("id, name, color")
    .order("display_order");

  return {
    order: order as Order | null,
    statuses: (statuses as { id: string; name: string; color: string }[]) || [],
  };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("vi-VN");
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { order, statuses } = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-secondary">
                {order.order_code}
              </h1>
              {order.order_statuses && (
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${order.order_statuses.color}20`,
                    color: order.order_statuses.color,
                  }}
                >
                  {order.order_statuses.name}
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              Tạo lúc {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>

        <OrderStatusUpdater
          orderId={order.id}
          currentStatusId={order.status_id}
          statuses={statuses}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-secondary mb-4">
              Thông tin khách hàng
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className="font-medium text-secondary">
                    {order.customer_name}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-1">
                    <a
                      href={`tel:${order.customer_phone}`}
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      {order.customer_phone}
                    </a>
                    {order.customer_email && (
                      <a
                        href={`mailto:${order.customer_email}`}
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        {order.customer_email}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-secondary">Địa chỉ giao hàng</p>
                  <p className="text-muted-foreground mt-1">
                    {order.delivery_address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary">Ngày giao hàng</p>
                  <p className="text-muted-foreground mt-1">
                    {formatDate(order.delivery_date)}
                  </p>
                </div>
              </div>

              {order.note && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-secondary">Ghi chú:</p>
                  <p className="text-muted-foreground mt-1">{order.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold text-secondary">
                Sản phẩm đặt hàng
              </h2>
            </div>
            <div className="divide-y divide-border">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-secondary">
                      {item.products?.name || "Sản phẩm"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.unit_price)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-secondary">
                    {formatCurrency(item.unit_price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-secondary mb-4">
              Tổng đơn hàng
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí giao hàng</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-secondary">
                    Tổng cộng
                  </span>
                  <span className="font-bold text-xl text-primary">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-secondary mb-4">Thao tác</h2>
            <div className="space-y-3">
              <a
                href={`tel:${order.customer_phone}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <Phone className="h-5 w-5 text-green-600" />
                <span>Gọi điện cho khách</span>
              </a>
              <button
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors w-full text-left"
                onClick={() => {
                  navigator.clipboard.writeText(order.delivery_address);
                }}
              >
                <Copy className="h-5 w-5 text-blue-600" />
                <span>Sao chép địa chỉ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

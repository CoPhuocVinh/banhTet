"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Pencil, Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";

type OrderItem = {
  id: string;
  quantity: number;
  unit_price: number;
  products: {
    name: string;
    slug: string;
  } | null;
};

interface OrderItemEditorProps {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function OrderItemEditor({
  orderId,
  items,
  totalAmount,
}: OrderItemEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState<
    { id: string; quantity: number; unit_price: number }[]
  >(items.map((item) => ({ id: item.id, quantity: item.quantity, unit_price: item.unit_price })));
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Update each order item
      for (const item of editedItems) {
        const { error } = await supabase
          .from("order_items")
          .update({
            quantity: item.quantity,
            unit_price: item.unit_price,
          } as never)
          .eq("id", item.id);

        if (error) throw error;
      }

      // Calculate new total
      const newTotal = editedItems.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );

      // Update order total
      const { error: orderError } = await supabase
        .from("orders")
        .update({ total_amount: newTotal } as never)
        .eq("id", orderId);

      if (orderError) throw orderError;

      toast.success("Đã cập nhật đơn hàng");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Không thể cập nhật đơn hàng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedItems(
      items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }))
    );
    setIsEditing(false);
  };

  const updateItem = (
    itemId: string,
    field: "quantity" | "unit_price",
    value: number
  ) => {
    setEditedItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const calculatedTotal = editedItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  if (!isEditing) {
    return (
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-secondary">Sản phẩm đặt hàng</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            Sửa giá
          </Button>
        </div>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
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
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-secondary">Chỉnh sửa đơn hàng</h2>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            disabled={loading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Hủy
          </Button>
          <Button size="sm" onClick={handleSave} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Check className="h-4 w-4 mr-1" />
            )}
            Lưu
          </Button>
        </div>
      </div>
      <div className="divide-y divide-border">
        {items.map((item, index) => {
          const editedItem = editedItems.find((e) => e.id === item.id);
          if (!editedItem) return null;

          return (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-secondary">
                  {item.products?.name || "Sản phẩm"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">Giá:</span>
                    <Input
                      type="number"
                      value={editedItem.unit_price}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "unit_price",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-[120px] h-8"
                    />
                  </div>
                  <span className="text-muted-foreground">×</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">SL:</span>
                    <Input
                      type="number"
                      min="1"
                      value={editedItem.quantity}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-[60px] h-8"
                    />
                  </div>
                </div>
              </div>
              <p className="font-semibold text-secondary">
                {formatCurrency(editedItem.unit_price * editedItem.quantity)}
              </p>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-border bg-muted/50">
        <div className="flex justify-between items-center">
          <span className="font-medium text-secondary">Tổng mới:</span>
          <span className="font-bold text-xl text-primary">
            {formatCurrency(calculatedTotal)}
          </span>
        </div>
        {calculatedTotal !== totalAmount && (
          <p className="text-sm text-muted-foreground mt-1">
            Tổng cũ: {formatCurrency(totalAmount)}
          </p>
        )}
      </div>
    </div>
  );
}

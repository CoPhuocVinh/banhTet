"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Pencil, Check, Loader2, X, Trash2, Plus } from "lucide-react";
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

type Product = {
  id: string;
  name: string;
  default_price: number;
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
    { id: string; quantity: number; unit_price: number; deleted?: boolean }[]
  >(
    items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))
  );
  const [newItems, setNewItems] = useState<
    { product_id: string; quantity: number; unit_price: number }[]
  >([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && products.length === 0) {
      fetchProducts();
    }
  }, [isEditing]);

  async function fetchProducts() {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("id, name, product_tier_prices(price)")
      .eq("is_available", true)
      .order("display_order");

    if (data) {
      const productsWithPrice = (
        data as {
          id: string;
          name: string;
          product_tier_prices: { price: number }[];
        }[]
      ).map((p) => ({
        id: p.id,
        name: p.name,
        default_price: p.product_tier_prices?.[0]?.price || 0,
      }));
      setProducts(productsWithPrice);
    }
  }

  const handleSave = async () => {
    const activeItems = editedItems.filter((item) => !item.deleted);
    const deletedItems = editedItems.filter((item) => item.deleted);
    const validNewItems = newItems.filter(
      (item) => item.product_id && item.quantity > 0
    );

    if (activeItems.length === 0 && validNewItems.length === 0) {
      toast.error("Đơn hàng phải có ít nhất 1 sản phẩm");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      // Delete removed items
      for (const item of deletedItems) {
        const { error } = await supabase
          .from("order_items")
          .delete()
          .eq("id", item.id);

        if (error) throw error;
      }

      // Update remaining items
      for (const item of activeItems) {
        const { error } = await supabase
          .from("order_items")
          .update({
            quantity: item.quantity,
            unit_price: item.unit_price,
          } as never)
          .eq("id", item.id);

        if (error) throw error;
      }

      // Insert new items
      if (validNewItems.length > 0) {
        const newOrderItems = validNewItems.map((item) => ({
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }));

        const { error: insertError } = await supabase
          .from("order_items")
          .insert(newOrderItems as never);

        if (insertError) throw insertError;
      }

      // Calculate new total
      const existingTotal = activeItems.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
      const newTotal =
        existingTotal +
        validNewItems.reduce(
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
      setNewItems([]);
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
        deleted: false,
      }))
    );
    setNewItems([]);
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

  const deleteItem = (itemId: string) => {
    setEditedItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, deleted: true } : item
      )
    );
  };

  const addNewItem = () => {
    setNewItems((prev) => [
      ...prev,
      { product_id: "", quantity: 1, unit_price: 0 },
    ]);
  };

  const updateNewItem = (
    index: number,
    field: "product_id" | "quantity" | "unit_price",
    value: string | number
  ) => {
    setNewItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        if (field === "product_id") {
          const product = products.find((p) => p.id === value);
          return {
            ...item,
            product_id: value as string,
            unit_price: product?.default_price || 0,
          };
        }

        return { ...item, [field]: value };
      })
    );
  };

  const removeNewItem = (index: number) => {
    setNewItems((prev) => prev.filter((_, i) => i !== index));
  };

  const activeItems = editedItems.filter((item) => !item.deleted);
  const existingTotal = activeItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  const newItemsTotal = newItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  const calculatedTotal = existingTotal + newItemsTotal;

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
            Sửa
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

      {/* Existing Items */}
      <div className="divide-y divide-border">
        {items.map((item) => {
          const editedItem = editedItems.find((e) => e.id === item.id);
          if (!editedItem || editedItem.deleted) return null;

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
              <div className="flex items-center gap-2">
                <p className="font-semibold text-secondary">
                  {formatCurrency(editedItem.unit_price * editedItem.quantity)}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteItem(item.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}

        {/* New Items */}
        {newItems.map((newItem, index) => (
          <div
            key={`new-${index}`}
            className="flex items-center gap-4 p-4 bg-green-50/50"
          >
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <Select
                value={newItem.product_id}
                onValueChange={(value) =>
                  updateNewItem(index, "product_id", value)
                }
              >
                <SelectTrigger className="h-8">
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
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">Giá:</span>
                  <Input
                    type="number"
                    value={newItem.unit_price || ""}
                    onChange={(e) =>
                      updateNewItem(
                        index,
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
                    value={newItem.quantity}
                    onChange={(e) =>
                      updateNewItem(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-[60px] h-8"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-secondary">
                {formatCurrency(newItem.unit_price * newItem.quantity)}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeNewItem(index)}
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="p-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addNewItem}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Summary */}
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
        {editedItems.some((item) => item.deleted) && (
          <p className="text-sm text-red-500 mt-1">
            {editedItems.filter((item) => item.deleted).length} sản phẩm sẽ bị
            xóa
          </p>
        )}
        {newItems.length > 0 && (
          <p className="text-sm text-green-600 mt-1">
            {newItems.filter((item) => item.product_id).length} sản phẩm mới sẽ
            được thêm
          </p>
        )}
      </div>
    </div>
  );
}

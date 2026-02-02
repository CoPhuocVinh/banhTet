"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Pencil,
  Check,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface CustomerInfoEditorProps {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryAddress: string;
  deliveryDate: string;
  note: string | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function CustomerInfoEditor({
  orderId,
  customerName,
  customerPhone,
  customerEmail,
  deliveryAddress,
  deliveryDate,
  note,
}: CustomerInfoEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: customerEmail || "",
    delivery_address: deliveryAddress,
    delivery_date: deliveryDate,
    note: note || "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_email: formData.customer_email || null,
          delivery_address: formData.delivery_address,
          delivery_date: formData.delivery_date,
          note: formData.note || null,
        } as never)
        .eq("id", orderId);

      if (error) throw error;

      toast.success("Đã cập nhật thông tin đơn hàng");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Không thể cập nhật thông tin");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail || "",
      delivery_address: deliveryAddress,
      delivery_date: deliveryDate,
      note: note || "",
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-secondary">Thông tin khách hàng</h2>
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
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <div>
              <p className="font-medium text-secondary">{customerName}</p>
              <div className="flex flex-wrap gap-4 mt-1">
                <a
                  href={`tel:${customerPhone}`}
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {customerPhone}
                </a>
                {customerEmail && (
                  <a
                    href={`mailto:${customerEmail}`}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    {customerEmail}
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
              <p className="text-muted-foreground mt-1">{deliveryAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-secondary">Ngày giao hàng</p>
              <p className="text-muted-foreground mt-1">
                {formatDate(deliveryDate)}
              </p>
            </div>
          </div>

          {note && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium text-secondary">Ghi chú:</p>
              <p className="text-muted-foreground mt-1">{note}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-secondary">Chỉnh sửa thông tin</h2>
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

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer_name">Tên khách hàng</Label>
            <Input
              id="customer_name"
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
          <Label htmlFor="customer_email">Email</Label>
          <Input
            id="customer_email"
            type="email"
            value={formData.customer_email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customer_email: e.target.value,
              }))
            }
            placeholder="Có thể bỏ trống"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery_address">Địa chỉ giao hàng</Label>
          <Input
            id="delivery_address"
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
          <Label htmlFor="delivery_date">Ngày giao hàng</Label>
          <Input
            id="delivery_date"
            type="date"
            value={formData.delivery_date}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                delivery_date: e.target.value,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Ghi chú</Label>
          <Input
            id="note"
            value={formData.note}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, note: e.target.value }))
            }
            placeholder="Ghi chú đơn hàng"
          />
        </div>
      </div>
    </div>
  );
}

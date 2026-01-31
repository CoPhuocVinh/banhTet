"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type OrderStatus = {
  id: string;
  name: string;
  color: string;
  display_order: number;
  created_at: string;
};

type StatusForm = {
  name: string;
  color: string;
  display_order: number;
};

const defaultForm: StatusForm = {
  name: "",
  color: "#6B7280",
  display_order: 0,
};

export default function OrderStatusesPage() {
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStatus, setEditingStatus] = useState<OrderStatus | null>(null);
  const [form, setForm] = useState<StatusForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchStatuses();
  }, []);

  async function fetchStatuses() {
    setLoading(true);
    const supabase = createClient();

    // Fetch statuses
    const { data } = await supabase
      .from("order_statuses")
      .select("*")
      .order("display_order");

    const statusList = (data as OrderStatus[]) || [];
    setStatuses(statusList);

    // Fetch usage counts for each status
    const counts: Record<string, number> = {};
    for (const status of statusList) {
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status_id", status.id);
      counts[status.id] = count || 0;
    }
    setUsageCounts(counts);

    setLoading(false);
  }

  function openCreateForm() {
    setEditingStatus(null);
    const maxOrder = statuses.reduce(
      (max, s) => Math.max(max, s.display_order),
      0
    );
    setForm({ ...defaultForm, display_order: maxOrder + 1 });
    setShowForm(true);
  }

  function openEditForm(status: OrderStatus) {
    setEditingStatus(status);
    setForm({
      name: status.name,
      color: status.color,
      display_order: status.display_order,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingStatus(null);
    setForm(defaultForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên trạng thái");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    if (editingStatus) {
      // Update
      const { error } = await supabase
        .from("order_statuses")
        .update({
          name: form.name,
          color: form.color,
          display_order: form.display_order,
        } as never)
        .eq("id", editingStatus.id);

      if (error) {
        toast.error("Không thể cập nhật trạng thái");
      } else {
        toast.success("Đã cập nhật trạng thái");
        fetchStatuses();
        closeForm();
      }
    } else {
      // Create
      const { error } = await supabase.from("order_statuses").insert({
        name: form.name,
        color: form.color,
        display_order: form.display_order,
      } as never);

      if (error) {
        toast.error("Không thể tạo trạng thái");
      } else {
        toast.success("Đã tạo trạng thái mới");
        fetchStatuses();
        closeForm();
      }
    }
    setSaving(false);
  }

  async function handleDelete(status: OrderStatus) {
    const count = usageCounts[status.id] || 0;
    if (count > 0) {
      toast.error(
        `Không thể xóa trạng thái "${status.name}" vì đang được sử dụng bởi ${count} đơn hàng`
      );
      return;
    }

    if (!confirm(`Bạn có chắc muốn xóa trạng thái "${status.name}"?`)) {
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("order_statuses")
      .delete()
      .eq("id", status.id);

    if (error) {
      toast.error("Không thể xóa trạng thái");
    } else {
      toast.success("Đã xóa trạng thái");
      fetchStatuses();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">
            Trạng thái đơn hàng
          </h1>
          <p className="text-muted-foreground">
            Quản lý các trạng thái cho đơn hàng
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm mới
        </Button>
      </div>

      {/* Statuses List */}
      <div className="bg-card rounded-xl border border-border">
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : statuses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <p>Chưa có trạng thái nào</p>
            <Button variant="link" onClick={openCreateForm}>
              Tạo mới
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {statuses.map((status) => (
              <div
                key={status.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                <div
                  className="w-8 h-8 rounded-lg"
                  style={{ backgroundColor: status.color }}
                />
                <div className="flex-1">
                  <p className="font-medium text-secondary">{status.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Thứ tự: {status.display_order}
                  </p>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${status.color}20`,
                    color: status.color,
                  }}
                >
                  {status.name}
                </div>
                <div className="text-sm text-muted-foreground min-w-[80px] text-right">
                  {usageCounts[status.id] || 0} đơn
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditForm(status)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(status)}
                    disabled={(usageCounts[status.id] || 0) > 0}
                  >
                    <Trash2
                      className={`h-4 w-4 ${
                        (usageCounts[status.id] || 0) > 0
                          ? "text-muted-foreground"
                          : "text-destructive"
                      }`}
                    />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeForm}
        >
          <div
            className="bg-card rounded-xl border border-border p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-secondary mb-4">
              {editingStatus ? "Sửa trạng thái" : "Thêm trạng thái"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên trạng thái *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Chờ xác nhận, Đang giao, Đã hoàn thành..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Thứ tự hiển thị</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Màu sắc</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-12 h-10 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    placeholder="#6B7280"
                    className="flex-1"
                  />
                  <div
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${form.color}20`,
                      color: form.color,
                    }}
                  >
                    Preview
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Hủy
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving
                    ? "Đang lưu..."
                    : editingStatus
                      ? "Cập nhật"
                      : "Tạo mới"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

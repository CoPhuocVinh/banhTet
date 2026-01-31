"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type PriceTier = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
};

type TierForm = {
  name: string;
  description: string;
  color: string;
};

const defaultForm: TierForm = {
  name: "",
  description: "",
  color: "#6B7280",
};

export default function PriceTiersPage() {
  const [tiers, setTiers] = useState<PriceTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTier, setEditingTier] = useState<PriceTier | null>(null);
  const [form, setForm] = useState<TierForm>(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTiers();
  }, []);

  async function fetchTiers() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("price_tiers")
      .select("*")
      .order("created_at");
    setTiers((data as PriceTier[]) || []);
    setLoading(false);
  }

  function openCreateForm() {
    setEditingTier(null);
    setForm(defaultForm);
    setShowForm(true);
  }

  function openEditForm(tier: PriceTier) {
    setEditingTier(tier);
    setForm({
      name: tier.name,
      description: tier.description || "",
      color: tier.color,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingTier(null);
    setForm(defaultForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên giai đoạn");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    if (editingTier) {
      // Update
      const { error } = await supabase
        .from("price_tiers")
        .update({
          name: form.name,
          description: form.description || null,
          color: form.color,
        } as never)
        .eq("id", editingTier.id);

      if (error) {
        toast.error("Không thể cập nhật giai đoạn giá");
      } else {
        toast.success("Đã cập nhật giai đoạn giá");
        fetchTiers();
        closeForm();
      }
    } else {
      // Create
      const { error } = await supabase.from("price_tiers").insert({
        name: form.name,
        description: form.description || null,
        color: form.color,
      } as never);

      if (error) {
        toast.error("Không thể tạo giai đoạn giá");
      } else {
        toast.success("Đã tạo giai đoạn giá mới");
        fetchTiers();
        closeForm();
      }
    }
    setSaving(false);
  }

  async function handleDelete(tier: PriceTier) {
    if (!confirm(`Bạn có chắc muốn xóa giai đoạn "${tier.name}"?`)) {
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("price_tiers")
      .delete()
      .eq("id", tier.id);

    if (error) {
      toast.error("Không thể xóa giai đoạn giá. Có thể đang được sử dụng.");
    } else {
      toast.success("Đã xóa giai đoạn giá");
      fetchTiers();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Giai đoạn giá</h1>
          <p className="text-muted-foreground">
            Quản lý các mức giá theo thời điểm
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm mới
        </Button>
      </div>

      {/* Tiers List */}
      <div className="bg-card rounded-xl border border-border">
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : tiers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <p>Chưa có giai đoạn giá nào</p>
            <Button variant="link" onClick={openCreateForm}>
              Tạo mới
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                <div
                  className="w-8 h-8 rounded-lg"
                  style={{ backgroundColor: tier.color }}
                />
                <div className="flex-1">
                  <p className="font-medium text-secondary">{tier.name}</p>
                  {tier.description && (
                    <p className="text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                  )}
                </div>
                <div
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${tier.color}20`,
                    color: tier.color,
                  }}
                >
                  Preview
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditForm(tier)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(tier)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
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
              {editingTier ? "Sửa giai đoạn giá" : "Thêm giai đoạn giá"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên giai đoạn *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="VD: Ngày thường, Cao điểm, Tết..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Mô tả thêm về giai đoạn này"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Màu sắc</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="color"
                    value={form.color}
                    onChange={(e) =>
                      setForm({ ...form, color: e.target.value })
                    }
                    className="w-12 h-10 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={form.color}
                    onChange={(e) =>
                      setForm({ ...form, color: e.target.value })
                    }
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
                  {saving ? "Đang lưu..." : editingTier ? "Cập nhật" : "Tạo mới"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

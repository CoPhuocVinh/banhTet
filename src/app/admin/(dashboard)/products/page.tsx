"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, Package, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type PriceTier = {
  id: string;
  name: string;
  color: string;
};

type ProductTierPrice = {
  tier_id: string;
  price: number;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  weight_grams: number;
  is_available: boolean;
  display_order: number;
  product_tier_prices: ProductTierPrice[];
};

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  weight_grams: number;
  is_available: boolean;
  prices: Record<string, number>;
};

const defaultForm: ProductForm = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  weight_grams: 500,
  is_available: true,
  prices: {},
};

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tiers, setTiers] = useState<PriceTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const supabase = createClient();

    const [productsRes, tiersRes] = await Promise.all([
      supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          description,
          image_url,
          weight_grams,
          is_available,
          display_order,
          product_tier_prices (
            tier_id,
            price
          )
        `)
        .order("display_order"),
      supabase.from("price_tiers").select("id, name, color").order("created_at"),
    ]);

    setProducts((productsRes.data as Product[]) || []);
    setTiers((tiersRes.data as PriceTier[]) || []);
    setLoading(false);
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  function openCreateForm() {
    setEditingProduct(null);
    const initialPrices: Record<string, number> = {};
    tiers.forEach((tier) => {
      initialPrices[tier.id] = 0;
    });
    setForm({ ...defaultForm, prices: initialPrices });
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    const prices: Record<string, number> = {};
    tiers.forEach((tier) => {
      const tierPrice = product.product_tier_prices.find(
        (p) => p.tier_id === tier.id
      );
      prices[tier.id] = tierPrice?.price || 0;
    });
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      image_url: product.image_url || "",
      weight_grams: product.weight_grams,
      is_available: product.is_available,
      prices,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
    setForm(defaultForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const productData = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      description: form.description || null,
      image_url: form.image_url || null,
      weight_grams: form.weight_grams,
      is_available: form.is_available,
    };

    if (editingProduct) {
      // Update product
      const { error: productError } = await supabase
        .from("products")
        .update(productData as never)
        .eq("id", editingProduct.id);

      if (productError) {
        toast.error("Không thể cập nhật sản phẩm");
        setSaving(false);
        return;
      }

      // Update prices - delete existing and insert new
      await supabase
        .from("product_tier_prices")
        .delete()
        .eq("product_id", editingProduct.id);

      const priceInserts = Object.entries(form.prices)
        .filter(([, price]) => price > 0)
        .map(([tierId, price]) => ({
          product_id: editingProduct.id,
          tier_id: tierId,
          price,
        }));

      if (priceInserts.length > 0) {
        await supabase.from("product_tier_prices").insert(priceInserts as never);
      }

      toast.success("Đã cập nhật sản phẩm");
    } else {
      // Create product
      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .insert(productData as never)
        .select("id")
        .single();

      if (productError || !newProduct) {
        toast.error("Không thể tạo sản phẩm");
        setSaving(false);
        return;
      }

      // Insert prices
      const priceInserts = Object.entries(form.prices)
        .filter(([, price]) => price > 0)
        .map(([tierId, price]) => ({
          product_id: (newProduct as { id: string }).id,
          tier_id: tierId,
          price,
        }));

      if (priceInserts.length > 0) {
        await supabase.from("product_tier_prices").insert(priceInserts as never);
      }

      toast.success("Đã tạo sản phẩm mới");
    }

    fetchData();
    closeForm();
    setSaving(false);
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      toast.error("Không thể xóa sản phẩm. Có thể đang được sử dụng trong đơn hàng.");
    } else {
      toast.success("Đã xóa sản phẩm");
      fetchData();
    }
  }

  async function toggleAvailability(product: Product) {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ is_available: !product.is_available } as never)
      .eq("id", product.id);

    if (error) {
      toast.error("Không thể cập nhật trạng thái");
    } else {
      fetchData();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Sản phẩm</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách sản phẩm
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Products List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <Package className="h-12 w-12 mb-2" />
            <p>Chưa có sản phẩm nào</p>
            <Button variant="link" onClick={openCreateForm}>
              Tạo mới
            </Button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Trọng lượng
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Giá theo tier
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-secondary">
                          {product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          /{product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {product.weight_grams}g
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {tiers.map((tier) => {
                        const tierPrice = product.product_tier_prices.find(
                          (p) => p.tier_id === tier.id
                        );
                        return (
                          <span
                            key={tier.id}
                            className="text-xs px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: `${tier.color}20`,
                              color: tier.color,
                            }}
                          >
                            {tier.name}: {tierPrice ? formatCurrency(tierPrice.price) : "-"}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleAvailability(product)}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                        product.is_available
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.is_available ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditForm(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeForm}
        >
          <div
            className="bg-card rounded-xl border border-border p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-secondary mb-4">
              {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên sản phẩm *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    placeholder="VD: Bánh tét lá cẩm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) =>
                      setForm({ ...form, slug: e.target.value })
                    }
                    placeholder="banh-tet-la-cam"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  rows={3}
                  placeholder="Mô tả sản phẩm..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL hình ảnh</Label>
                  <Input
                    id="image_url"
                    value={form.image_url}
                    onChange={(e) =>
                      setForm({ ...form, image_url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Trọng lượng (gram)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={form.weight_grams}
                    onChange={(e) =>
                      setForm({ ...form, weight_grams: parseInt(e.target.value) || 0 })
                    }
                    placeholder="500"
                  />
                </div>
              </div>

              {/* Tier Prices */}
              <div className="space-y-2">
                <Label>Giá theo giai đoạn</Label>
                <div className="grid grid-cols-2 gap-3">
                  {tiers.map((tier) => (
                    <div key={tier.id} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: tier.color }}
                      />
                      <span className="text-sm min-w-[80px]">{tier.name}</span>
                      <Input
                        type="number"
                        value={form.prices[tier.id] || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            prices: {
                              ...form.prices,
                              [tier.id]: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        placeholder="0"
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground">đ</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_available"
                  checked={form.is_available}
                  onChange={(e) =>
                    setForm({ ...form, is_available: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="is_available" className="cursor-pointer">
                  Đang bán
                </Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Hủy
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Đang lưu..." : editingProduct ? "Cập nhật" : "Tạo mới"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2, Utensils, Heart, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type AboutSettings = {
  about_section_label: string;
  about_title: string;
  about_title_highlight: string;
  about_description1: string;
  about_description2: string;
  about_image_url: string;
  about_badge_value: string;
  about_badge_label: string;
  about_stat1_value: string;
  about_stat1_label: string;
  about_stat2_value: string;
  about_stat2_label: string;
  about_stat3_value: string;
  about_stat3_label: string;
  about_stat4_value: string;
  about_stat4_label: string;
};

const defaultSettings: AboutSettings = {
  about_section_label: "Về chúng tôi",
  about_title: "Hương vị truyền thống,",
  about_title_highlight: "chất lượng hiện đại",
  about_description1:
    "Với hơn 10 năm kinh nghiệm, chúng tôi tự hào mang đến những chiếc bánh tét thơm ngon, được làm từ nguyên liệu tươi sạch và công thức gia truyền. Mỗi chiếc bánh là tâm huyết của người thợ làm bánh, gói trọn hương vị Tết Việt.",
  about_description2:
    "Từ lá chuối tươi đến nếp thơm, đậu xanh bùi béo - tất cả đều được chọn lọc kỹ càng. Chúng tôi cam kết mang đến cho bạn những chiếc bánh tét ngon nhất, an toàn nhất.",
  about_image_url: "https://cdn.efl.vn/banhTetImg/brand-story.jpg",
  about_badge_value: "10+",
  about_badge_label: "Năm kinh nghiệm",
  about_stat1_value: "8+",
  about_stat1_label: "Loại bánh",
  about_stat2_value: "1000+",
  about_stat2_label: "Khách hàng",
  about_stat3_value: "10+",
  about_stat3_label: "Năm kinh nghiệm",
  about_stat4_value: "100%",
  about_stat4_label: "Hài lòng",
};

const settingKeys = Object.keys(defaultSettings) as (keyof AboutSettings)[];

const statIcons = [Utensils, Heart, Clock, Users];

export default function AboutSettingsPage() {
  const [settings, setSettings] = useState<AboutSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    const supabase = createClient();

    const { data } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", settingKeys);

    if (data && data.length > 0) {
      const loadedSettings = { ...defaultSettings };
      data.forEach((item: { key: string; value: string }) => {
        if (item.key in loadedSettings) {
          loadedSettings[item.key as keyof AboutSettings] = item.value;
        }
      });
      setSettings(loadedSettings);
    }

    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();

    // Upsert all settings
    const upsertData = settingKeys.map((key) => ({
      key,
      value: settings[key],
    }));

    // Delete existing and insert new (simpler than upsert with unique constraint)
    const { error: deleteError } = await supabase
      .from("site_settings")
      .delete()
      .in("key", settingKeys);

    if (deleteError) {
      toast.error("Không thể lưu cài đặt");
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("site_settings")
      .insert(upsertData as never);

    if (insertError) {
      toast.error("Không thể lưu cài đặt");
    } else {
      toast.success("Đã lưu cài đặt thành công");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">
            Trang &quot;Về chúng tôi&quot;
          </h1>
          <p className="text-muted-foreground">
            Chỉnh sửa nội dung hiển thị ở phần giới thiệu trên trang chủ
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Lưu cài đặt
            </>
          )}
        </Button>
      </div>

      {/* Section Title */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">
          Tiêu đề phần
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section_label">Nhãn phần (phía trên tiêu đề)</Label>
            <Input
              id="section_label"
              value={settings.about_section_label}
              onChange={(e) =>
                setSettings({ ...settings, about_section_label: e.target.value })
              }
              placeholder="Về chúng tôi"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề chính</Label>
              <Input
                id="title"
                value={settings.about_title}
                onChange={(e) =>
                  setSettings({ ...settings, about_title: e.target.value })
                }
                placeholder="Hương vị truyền thống,"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_highlight">Phần highlight (màu đỏ)</Label>
              <Input
                id="title_highlight"
                value={settings.about_title_highlight}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    about_title_highlight: e.target.value,
                  })
                }
                placeholder="chất lượng hiện đại"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">
          Nội dung mô tả
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="desc1">Đoạn mô tả 1</Label>
            <Textarea
              id="desc1"
              rows={4}
              value={settings.about_description1}
              onChange={(e) =>
                setSettings({ ...settings, about_description1: e.target.value })
              }
              placeholder="Đoạn mô tả chính..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc2">Đoạn mô tả 2</Label>
            <Textarea
              id="desc2"
              rows={3}
              value={settings.about_description2}
              onChange={(e) =>
                setSettings({ ...settings, about_description2: e.target.value })
              }
              placeholder="Đoạn mô tả phụ..."
            />
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">Hình ảnh</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image_url">URL hình ảnh</Label>
            <Input
              id="image_url"
              value={settings.about_image_url}
              onChange={(e) =>
                setSettings({ ...settings, about_image_url: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {settings.about_image_url && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Xem trước:</p>
              <img
                src={settings.about_image_url}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="badge_value">Badge - Giá trị</Label>
              <Input
                id="badge_value"
                value={settings.about_badge_value}
                onChange={(e) =>
                  setSettings({ ...settings, about_badge_value: e.target.value })
                }
                placeholder="10+"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge_label">Badge - Nhãn</Label>
              <Input
                id="badge_label"
                value={settings.about_badge_label}
                onChange={(e) =>
                  setSettings({ ...settings, about_badge_label: e.target.value })
                }
                placeholder="Năm kinh nghiệm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">
          Thống kê (4 ô số liệu)
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((num) => {
            const Icon = statIcons[num - 1];
            const valueKey = `about_stat${num}_value` as keyof AboutSettings;
            const labelKey = `about_stat${num}_label` as keyof AboutSettings;

            return (
              <div key={num} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor={valueKey}>Giá trị {num}</Label>
                    <Input
                      id={valueKey}
                      value={settings[valueKey]}
                      onChange={(e) =>
                        setSettings({ ...settings, [valueKey]: e.target.value })
                      }
                      placeholder="8+"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={labelKey}>Nhãn {num}</Label>
                    <Input
                      id={labelKey}
                      value={settings[labelKey]}
                      onChange={(e) =>
                        setSettings({ ...settings, [labelKey]: e.target.value })
                      }
                      placeholder="Loại bánh"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button (bottom) */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Lưu cài đặt
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

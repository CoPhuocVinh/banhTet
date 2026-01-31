"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type SettingsForm = {
  contact_hotline: string;
  contact_email: string;
  contact_address: string;
  social_facebook: string;
  social_zalo: string;
  brand_name_vi: string;
  brand_name_en: string;
  brand_slogan_vi: string;
  brand_slogan_en: string;
};

const defaultSettings: SettingsForm = {
  contact_hotline: "",
  contact_email: "",
  contact_address: "",
  social_facebook: "",
  social_zalo: "",
  brand_name_vi: "",
  brand_name_en: "",
  brand_slogan_vi: "",
  brand_slogan_en: "",
};

const settingKeys = Object.keys(defaultSettings) as (keyof SettingsForm)[];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsForm>(defaultSettings);
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

    if (data) {
      const loadedSettings = { ...defaultSettings };
      data.forEach((item: { key: string; value: string }) => {
        if (item.key in loadedSettings) {
          loadedSettings[item.key as keyof SettingsForm] = item.value;
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
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Cài đặt website</h1>
          <p className="text-muted-foreground">
            Cấu hình thông tin liên hệ và thương hiệu
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

      {/* Contact Info */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">
          Thông tin liên hệ
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hotline">Hotline</Label>
            <Input
              id="hotline"
              value={settings.contact_hotline}
              onChange={(e) =>
                setSettings({ ...settings, contact_hotline: e.target.value })
              }
              placeholder="0909 123 456"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.contact_email}
              onChange={(e) =>
                setSettings({ ...settings, contact_email: e.target.value })
              }
              placeholder="contact@banhtet.vn"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={settings.contact_address}
              onChange={(e) =>
                setSettings({ ...settings, contact_address: e.target.value })
              }
              placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">
          Mạng xã hội
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={settings.social_facebook}
              onChange={(e) =>
                setSettings({ ...settings, social_facebook: e.target.value })
              }
              placeholder="https://facebook.com/banhtet"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zalo">Zalo</Label>
            <Input
              id="zalo"
              value={settings.social_zalo}
              onChange={(e) =>
                setSettings({ ...settings, social_zalo: e.target.value })
              }
              placeholder="https://zalo.me/0909123456"
            />
          </div>
        </div>
      </div>

      {/* Brand Info */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">
          Thông tin thương hiệu
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand_name_vi">Tên thương hiệu (Tiếng Việt)</Label>
              <Input
                id="brand_name_vi"
                value={settings.brand_name_vi}
                onChange={(e) =>
                  setSettings({ ...settings, brand_name_vi: e.target.value })
                }
                placeholder="Bánh Tét Cô Ba"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand_name_en">Tên thương hiệu (English)</Label>
              <Input
                id="brand_name_en"
                value={settings.brand_name_en}
                onChange={(e) =>
                  setSettings({ ...settings, brand_name_en: e.target.value })
                }
                placeholder="Co Ba Banh Tet"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slogan_vi">Slogan (Tiếng Việt)</Label>
              <Input
                id="slogan_vi"
                value={settings.brand_slogan_vi}
                onChange={(e) =>
                  setSettings({ ...settings, brand_slogan_vi: e.target.value })
                }
                placeholder="Hương vị Tết truyền thống"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slogan_en">Slogan (English)</Label>
              <Input
                id="slogan_en"
                value={settings.brand_slogan_en}
                onChange={(e) =>
                  setSettings({ ...settings, brand_slogan_en: e.target.value })
                }
                placeholder="Traditional Tet Flavors"
              />
            </div>
          </div>
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

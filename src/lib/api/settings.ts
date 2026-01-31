import { createClient } from "@/lib/supabase/server";
import type { SiteSetting } from "@/lib/supabase/types";

export interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  facebook_url: string;
  zalo_url: string;
  min_order_amount: number;
  delivery_fee: number;
  free_delivery_threshold: number;
}

const defaultSettings: SiteSettings = {
  site_name: "Bánh Tét Tết",
  site_description: "Đặt bánh tét Tết chất lượng cao, giao hàng tận nơi",
  contact_phone: "0901234567",
  contact_email: "contact@banhtet.vn",
  contact_address: "TP. Hồ Chí Minh, Việt Nam",
  facebook_url: "https://facebook.com/banhtettet",
  zalo_url: "https://zalo.me/banhtettet",
  min_order_amount: 100000,
  delivery_fee: 30000,
  free_delivery_threshold: 500000,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();

    const { data: rawData, error } = await supabase
      .from("site_settings")
      .select("*");

    if (error) {
      console.error("Error fetching site settings:", error);
      return defaultSettings;
    }

    const data = (rawData || []) as SiteSetting[];

    if (data.length === 0) {
      return defaultSettings;
    }

    const settings: SiteSettings = { ...defaultSettings };

    data.forEach((row) => {
      const key = row.key;
      const value = row.value;

      switch (key) {
        case "site_name":
          settings.site_name = value;
          break;
        case "site_description":
          settings.site_description = value;
          break;
        case "contact_phone":
          settings.contact_phone = value;
          break;
        case "contact_email":
          settings.contact_email = value;
          break;
        case "contact_address":
          settings.contact_address = value;
          break;
        case "facebook_url":
          settings.facebook_url = value;
          break;
        case "zalo_url":
          settings.zalo_url = value;
          break;
        case "min_order_amount":
          settings.min_order_amount = parseInt(value, 10) || 0;
          break;
        case "delivery_fee":
          settings.delivery_fee = parseInt(value, 10) || 0;
          break;
        case "free_delivery_threshold":
          settings.free_delivery_threshold = parseInt(value, 10) || 0;
          break;
      }
    });

    return settings;
  } catch {
    return defaultSettings;
  }
}

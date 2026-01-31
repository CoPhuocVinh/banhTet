import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { OrderSuccessClient } from "./OrderSuccessClient";

interface OrderSuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string }>;
}

async function getContactPhone() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "contact_phone")
    .single();
  return data?.value || "0901234567";
}

export async function generateMetadata({
  params,
}: OrderSuccessPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title:
      locale === "vi"
        ? "Đặt Hàng Thành Công - Bánh Tét Tết"
        : "Order Success - Bánh Tét Tết",
    description:
      locale === "vi"
        ? "Cảm ơn bạn đã đặt hàng!"
        : "Thank you for your order!",
  };
}

export default async function OrderSuccessPage({
  params,
  searchParams,
}: OrderSuccessPageProps) {
  const { locale } = await params;
  const { code } = await searchParams;
  setRequestLocale(locale);

  const contactPhone = await getContactPhone();

  return <OrderSuccessClient orderCode={code} contactPhone={contactPhone} />;
}

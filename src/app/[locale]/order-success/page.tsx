import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { OrderSuccessClient } from "./OrderSuccessClient";

interface OrderSuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string }>;
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

  return <OrderSuccessClient orderCode={code} />;
}

import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPriceTiers, getDateTierAssignments } from "@/lib/api/pricing";
import { CheckoutPageClient } from "./CheckoutPageClient";

interface CheckoutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === "vi" ? "Đặt Hàng - Bánh Tét Tết" : "Checkout - Bánh Tét Tết",
    description:
      locale === "vi"
        ? "Hoàn tất đặt hàng bánh tét Tết"
        : "Complete your bánh tét order",
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch pricing data for date selection
  const [tiers, dateAssignments] = await Promise.all([
    getPriceTiers(),
    getDateTierAssignments(),
  ]);

  return (
    <CheckoutPageClient
      tiers={tiers}
      dateAssignments={dateAssignments}
    />
  );
}

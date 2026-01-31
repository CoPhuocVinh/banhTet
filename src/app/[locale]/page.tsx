import { setRequestLocale } from "next-intl/server";
import {
  HeroSection,
  BrandSection,
  FeaturedProducts,
  PricingTable,
  ScheduleCalendar,
  CTASection,
} from "@/components/sections";
import { getProducts } from "@/lib/api/products";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch products for featured section
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <BrandSection />
      <FeaturedProducts products={products} />
      <PricingTable />
      <ScheduleCalendar />
      <CTASection />
    </div>
  );
}

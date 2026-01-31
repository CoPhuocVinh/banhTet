import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getProducts } from "@/lib/api/products";
import { ProductsPageClient } from "./ProductsPageClient";

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });

  return {
    title: locale === "vi" ? "Sản Phẩm - Bánh Tét Tết" : "Products - Bánh Tét Tết",
    description:
      locale === "vi"
        ? "Khám phá các loại bánh tét truyền thống chất lượng cao. Bánh tét đậu xanh, bánh tét thịt, bánh tét chuối và nhiều hơn nữa."
        : "Discover our high-quality traditional bánh tét. Green bean bánh tét, pork bánh tét, banana bánh tét and more.",
    openGraph: {
      title: t("title"),
      description:
        locale === "vi"
          ? "Khám phá các loại bánh tét truyền thống"
          : "Discover traditional bánh tét varieties",
    },
  };
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getProducts();

  return <ProductsPageClient products={products} />;
}

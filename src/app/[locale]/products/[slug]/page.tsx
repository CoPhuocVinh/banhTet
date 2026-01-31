import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getProductBySlug, getProducts } from "@/lib/api/products";
import { ProductDetailClient } from "./ProductDetailClient";

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: locale === "vi" ? "Không tìm thấy" : "Not Found",
    };
  }

  return {
    title: `${product.name} - Bánh Tét Tết`,
    description:
      product.description ||
      (locale === "vi"
        ? `Đặt ${product.name} chất lượng cao, giao hàng tận nơi.`
        : `Order high-quality ${product.name}, home delivery.`),
    openGraph: {
      title: product.name,
      description: product.description || "",
      images: product.image_url
        ? [
            {
              url: product.image_url.startsWith("http")
                ? product.image_url
                : `https://cdn.efl.vn/banhTetImg/${product.image_url}`,
              alt: product.name,
            },
          ]
        : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products (other products, excluding current)
  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  );
}

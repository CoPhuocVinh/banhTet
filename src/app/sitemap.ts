import { MetadataRoute } from "next";
import { locales } from "@/i18n/config";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://banhtet.vn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/products", "/checkout"];

  const routes: MetadataRoute.Sitemap = [];

  // Add static routes for each locale
  for (const locale of locales) {
    for (const route of staticRoutes) {
      routes.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1 : 0.8,
      });
    }
  }

  // TODO: Add dynamic product routes when fetching from database
  // const products = await getProducts();
  // for (const product of products) {
  //   for (const locale of locales) {
  //     routes.push({
  //       url: `${baseUrl}/${locale}/products/${product.slug}`,
  //       lastModified: new Date(product.updated_at),
  //       changeFrequency: "weekly",
  //       priority: 0.6,
  //     });
  //   }
  // }

  return routes;
}

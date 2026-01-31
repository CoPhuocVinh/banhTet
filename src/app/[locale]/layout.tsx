import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { locales, type Locale } from "@/i18n/config";
import { Header, Footer, FloatingCTA } from "@/components/layout";
import "../globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://banhtet.vn";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Bánh Tét Tết - Đặt Bánh Tét Tết Online",
    template: "%s | Bánh Tét Tết",
  },
  description:
    "Đặt bánh tét Tết chất lượng cao, giao hàng tận nơi. Bánh tét truyền thống, bánh tét đậu xanh, bánh tét chuối - Hương vị Tết Việt.",
  keywords: [
    "bánh tét",
    "tết",
    "bánh tét tết",
    "đặt bánh tét",
    "bánh tết",
    "bánh tét đậu xanh",
    "bánh tét chuối",
  ],
  authors: [{ name: "Bánh Tét Tết" }],
  creator: "Bánh Tét Tết",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    alternateLocale: "en_US",
    url: baseUrl,
    siteName: "Bánh Tét Tết",
    title: "Bánh Tét Tết - Đặt Bánh Tét Tết Online",
    description:
      "Đặt bánh tét Tết chất lượng cao, giao hàng tận nơi. Hương vị Tết Việt truyền thống.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bánh Tét Tết",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bánh Tét Tết - Đặt Bánh Tét Tết Online",
    description:
      "Đặt bánh tét Tết chất lượng cao, giao hàng tận nơi. Hương vị Tết Việt truyền thống.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${beVietnamPro.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
          <FloatingCTA />
          <Toaster position="top-center" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

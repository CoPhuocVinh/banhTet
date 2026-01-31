import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed", // Don't add locale prefix for default locale
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - /static (public static files)
    // - Files with extensions (.jpg, .svg, etc.)
    "/((?!api|_next|_vercel|static|.*\\..*).*)",
  ],
};

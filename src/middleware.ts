import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "./i18n/config";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle admin routes with auth
  if (pathname.startsWith("/admin")) {
    return updateSession(request);
  }

  // Handle i18n for other routes
  return intlMiddleware(request);
}

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

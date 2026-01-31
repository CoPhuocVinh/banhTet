"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname and add new locale
    const pathWithoutLocale = pathname.replace(/^\/(vi|en)/, "") || "";
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-background/50 p-1 backdrop-blur-sm">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            locale === loc
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;

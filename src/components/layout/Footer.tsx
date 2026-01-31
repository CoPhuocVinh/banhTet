"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Phone, Mail, MapPin, Facebook, MessageCircle } from "lucide-react";

interface FooterProps {
  siteSettings?: {
    contact_phone?: string;
    contact_email?: string;
    contact_address?: string;
    facebook_url?: string;
    zalo_url?: string;
  };
}

export function Footer({ siteSettings }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const {
    contact_phone = "0901234567",
    contact_email = "contact@banhtet.vn",
    contact_address = "TP. Hồ Chí Minh, Việt Nam",
    facebook_url = "https://facebook.com/banhtettet",
    zalo_url = "https://zalo.me/banhtettet",
  } = siteSettings || {};

  const quickLinks = [
    { href: `/${locale}`, label: tNav("home") },
    { href: `/${locale}/products`, label: tNav("products") },
    { href: `/${locale}#about`, label: tNav("about") },
    { href: `/${locale}/order`, label: tNav("order") },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-foreground">
                Bánh Tét
              </span>
              <span className="text-2xl font-bold text-accent">Tết</span>
            </Link>
            <p className="text-secondary-foreground/80 text-sm">
              {t("description")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary-foreground/80 hover:text-accent text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t("contact")}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${contact_phone}`}
                  className="flex items-center gap-2 text-secondary-foreground/80 hover:text-accent text-sm transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {contact_phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact_email}`}
                  className="flex items-center gap-2 text-secondary-foreground/80 hover:text-accent text-sm transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {contact_email}
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2 text-secondary-foreground/80 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  {contact_address}
                </span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t("followUs")}</h3>
            <div className="flex gap-4">
              {facebook_url && (
                <a
                  href={facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {zalo_url && (
                <a
                  href={zalo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label="Zalo"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-secondary-foreground/10">
          <p className="text-center text-secondary-foreground/60 text-sm">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

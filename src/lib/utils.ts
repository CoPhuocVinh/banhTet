import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate order code in format: BT-YYMMDD-XXXX
 * Example: BT-260127-A1B2
 */
export function generateOrderCode(): string {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `BT-${year}${month}${day}-${randomPart}`;
}

/**
 * Get the full URL for product images
 * If the image_url is already a full URL, return it as-is
 * Otherwise, prepend the CDN URL
 */
export function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.efl.vn/banhTetImg";
  return `${cdnUrl}/${imageUrl}`;
}

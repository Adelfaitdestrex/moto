import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Moto, FilterState } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "DA"): string {
  if (typeof price !== "number" || isNaN(price)) return `0 ${currency}`;
  const formattedNumber = new Intl.NumberFormat("fr-DZ", {
    maximumFractionDigits: 0,
  }).format(price);
  return `${formattedNumber} ${currency}`;
}

export function cleanPhoneNumber(phone: string): string {
  if (!phone) return "";
  // Remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");
  // If starts with 0 (Algerian local format 0550...), replace 0 with +213
  if (cleaned.startsWith("0")) {
    cleaned = "+213" + cleaned.substring(1);
  }
  // Strip leading '+' for wa.me link
  return cleaned.replace("+", "");
}

export function generateWhatsAppLink(phone: string, message: string): string {
  const number = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedText}`;
}

export function generateMotoInquiryMessage(moto: Moto, dealershipName: string = "Maison Moto"): string {
  const formattedPrice = formatPrice(moto.price, moto.currency || "DA");
  return `Bonjour ${dealershipName}, je suis intéressé par la ${moto.brand} ${moto.model} (${moto.year}) affichée à ${formattedPrice}. Est-elle toujours disponible ?`;
}

export function filterMotos(motos: Moto[], filters: FilterState): Moto[] {
  return motos.filter((moto) => {
    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      const matchSearch =
        moto.brand.toLowerCase().includes(q) ||
        moto.model.toLowerCase().includes(q) ||
        moto.category.toLowerCase().includes(q) ||
        moto.description.toLowerCase().includes(q) ||
        moto.year.toString().includes(q);
      if (!matchSearch) return false;
    }

    // Brand filter
    if (filters.brand && filters.brand !== "all") {
      if (moto.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
    }

    // Category filter
    if (filters.category && filters.category !== "all") {
      if (moto.category !== filters.category) return false;
    }

    // Min Price
    if (filters.minPrice && !isNaN(Number(filters.minPrice))) {
      if (moto.price < Number(filters.minPrice)) return false;
    }

    // Max Price
    if (filters.maxPrice && !isNaN(Number(filters.maxPrice))) {
      if (moto.price > Number(filters.maxPrice)) return false;
    }

    // Min Year
    if (filters.minYear && !isNaN(Number(filters.minYear))) {
      if (moto.year < Number(filters.minYear)) return false;
    }

    // Max Year
    if (filters.maxYear && !isNaN(Number(filters.maxYear))) {
      if (moto.year > Number(filters.maxYear)) return false;
    }

    // Condition
    if (filters.condition && filters.condition !== "all") {
      if (moto.condition !== filters.condition) return false;
    }

    // Status
    if (filters.status && filters.status !== "all") {
      if (moto.status !== filters.status) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "oldest":
        return a.createdAt - b.createdAt;
      case "newest":
      default:
        return b.createdAt - a.createdAt;
    }
  });
}

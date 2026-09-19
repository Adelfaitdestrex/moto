export type Category = 
  | "Scooter"
  | "Sportive"
  | "Naked"
  | "Trail"
  | "Custom"
  | "Cross"
  | "Enduro"
  | "Touring"
  | "Autre";

export type MotoCondition = "new" | "used";
export type MotoStatus = "available" | "reserved" | "sold";

export interface Moto {
  id: string;
  brand: string;
  model: string;
  category: Category;
  year: number;
  price: number;
  currency: string;
  condition: MotoCondition;
  status: MotoStatus;
  engine: string;        // ex: "689cc"
  power: string;         // ex: "73 ch"
  mileage: number;       // ex: 0
  transmission: string;  // ex: "6 vitesses"
  fuel: string;          // ex: "Essence"
  color: string;         // ex: "Noir"
  description: string;
  images: string[];
  featured: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SiteSettings {
  name: string;
  logo: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  wilaya: string;
  instagram: string;
  facebook: string;
  openingHours: string;
  primaryColor: string; // Hex color (e.g. #ef4444)
  currency: string;
  showPrices: boolean;
  showSold: boolean;
  whatsappButtonText: string;
}

export interface FilterState {
  search: string;
  brand: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  condition: string;
  status: string;
  sortBy: "price-asc" | "price-desc" | "newest" | "oldest";
}

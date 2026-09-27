export interface Product {
  id: string;
  name: string;
  game: string;
  image: string;
  images: string[];
  price: number;
  discountPrice?: number | null;
  rating: number;
  badge: 'HOT' | 'PELAJAR' | 'SULTAN' | 'LIMITED' | string;
  specs: string[];
  flash: boolean;
  sold: boolean;
  soldPrice?: number | null;
  soldAt?: number | null;
  level?: number;
  vaultCount?: number;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  image: string;
  itemCount?: number;
}

export interface Banner {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

export interface GroupChannel {
  id: string;
  name: string;
  image: string;
  url: string;
  type?: 'whatsapp' | 'channel' | 'tiktok';
  memberInfo?: string;
}

export interface Testimonial {
  id: string;
  buyerName: string;
  avatar?: string;
  accountBought: string;
  game: string;
  price: number;
  date: string;
  comment: string;
  rating: number;
  imageProof?: string;
  verified: boolean;
}

export interface StoreConfig {
  brandName: string;
  logo: string;
  banner: string;
  tagline: string;
  description: string;
  waNumber: string;
  operatingHours: string;
  customerServiceNumber: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  adminPassword?: string;
  adminPin?: string;
  sessionTimeoutMinutes?: number;
  securityMode?: 'standard' | 'high' | 'ultra';
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

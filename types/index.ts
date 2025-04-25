// Product data types
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  size?: string;
  careLevel?: string;
  category: string;
}

// Cart item type
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order type
export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: CartItem[];
}

// Currency type
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'TRY' | 'SAR';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

// Theme mode type
export type ThemeMode = 'light' | 'dark' | 'system';

// Language code type
export type LanguageCode = 'en' | 'ar' | 'tr';
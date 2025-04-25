import { create } from 'zustand';
import { Currency, CurrencyCode } from '@/types';
import { storage } from '@/utils/storage';

const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
};

// Exchange rates against USD (simplified for demo)
const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  TRY: 31.78,
  SAR: 3.75,
};

interface CurrencyStore {
  currentCurrency: Currency;
  setCurrency: (code: CurrencyCode) => Promise<void>;
  formatPrice: (price: number) => string;
  convertPrice: (priceInUSD: number) => number;
  currencies: typeof CURRENCIES;
}

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  currentCurrency: CURRENCIES.USD,
  currencies: CURRENCIES,
  
  setCurrency: async (code: CurrencyCode) => {
    try {
      const currency = CURRENCIES[code];
      await storage.setItem('currency', code);
      set({ currentCurrency: currency });
    } catch (error) {
      console.error('Failed to save currency preference:', error);
    }
  },
  
  formatPrice: (price: number) => {
    const { currentCurrency } = get();
    const convertedPrice = get().convertPrice(price);
    
    return `${currentCurrency.symbol}${convertedPrice.toFixed(2)}`;
  },
  
  convertPrice: (priceInUSD: number) => {
    const { currentCurrency } = get();
    const rate = EXCHANGE_RATES[currentCurrency.code];
    return priceInUSD * rate;
  },
}));

// Initialize currency from storage
(async () => {
  try {
    const savedCurrency = await storage.getItem('currency');
    if (savedCurrency && CURRENCIES[savedCurrency as CurrencyCode]) {
      useCurrencyStore.setState({ 
        currentCurrency: CURRENCIES[savedCurrency as CurrencyCode] 
      });
    }
  } catch (error) {
    console.error('Failed to load currency preference:', error);
  }
})();
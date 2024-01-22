import { ObjectPrice } from '@/types';
import { create } from 'zustand';

interface TokenStore {
  prices: ObjectPrice;
  tokens: string[];
  setPrices: (prices: ObjectPrice) => void;
  setTokens: (tokens: string[]) => void;
}

const useTokenStore = create<TokenStore>((set) => ({
  prices: {},
  tokens: [],
  setPrices: (prices) =>
    set(() => ({
      prices: prices,
    })),
  setTokens: (tokens) => set(() => ({ tokens: tokens })),
}));

export default useTokenStore;

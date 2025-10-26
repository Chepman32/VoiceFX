/**
 * IAP Store Slice - Manages in-app purchases
 */

import {StateCreator} from 'zustand';
import {IAPProduct} from '@/types/common';

export interface IAPSlice {
  products: IAPProduct[];
  purchasedProductIds: string[];
  isPro: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProducts: (products: IAPProduct[]) => void;
  addPurchase: (productId: string) => void;
  setPro: (isPro: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  restorePurchases: () => void;
}

export const createIAPSlice: StateCreator<IAPSlice> = set => ({
  products: [],
  purchasedProductIds: [],
  isPro: false,
  isLoading: false,
  error: null,

  setProducts: products => set({products}),

  addPurchase: productId =>
    set(state => {
      const isPro = productId === 'pro_unlock' || state.isPro;
      return {
        purchasedProductIds: [...state.purchasedProductIds, productId],
        isPro,
        products: state.products.map(p =>
          p.id === productId ? {...p, isPurchased: true} : p
        ),
      };
    }),

  setPro: isPro => set({isPro}),
  setLoading: isLoading => set({isLoading}),
  setError: error => set({error}),

  restorePurchases: () => {
    // This will be implemented with actual IAP logic
    set({isLoading: true});
  },
});

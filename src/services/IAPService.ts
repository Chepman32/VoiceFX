/**
 * In-App Purchase Service
 * Handles all IAP operations including purchases, subscriptions, and restore
 */

import {Platform} from 'react-native';
import RNIap, {
  Product,
  ProductPurchase,
  PurchaseError,
  finishTransaction,
  requestPurchase,
  requestSubscription,
} from 'react-native-iap';
import {useStore} from '@/store';

// Product IDs
export const IAP_PRODUCTS = {
  PRO_LIFETIME: Platform.select({
    ios: 'com.voicefx.pro.lifetime',
    android: 'com.voicefx.pro.lifetime',
  })!,
  PRO_MONTHLY: Platform.select({
    ios: 'com.voicefx.pro.monthly',
    android: 'com.voicefx.pro.monthly',
  })!,
  PRO_YEARLY: Platform.select({
    ios: 'com.voicefx.pro.yearly',
    android: 'com.voicefx.pro.yearly',
  })!,
  EFFECT_PACK_1: Platform.select({
    ios: 'com.voicefx.effectpack.1',
    android: 'com.voicefx.effectpack.1',
  })!,
  EFFECT_PACK_2: Platform.select({
    ios: 'com.voicefx.effectpack.2',
    android: 'com.voicefx.effectpack.2',
  })!,
};

// Subscription IDs
const SUBSCRIPTION_IDS = [IAP_PRODUCTS.PRO_MONTHLY, IAP_PRODUCTS.PRO_YEARLY];

// Product IDs (non-consumable)
const PRODUCT_IDS = [
  IAP_PRODUCTS.PRO_LIFETIME,
  IAP_PRODUCTS.EFFECT_PACK_1,
  IAP_PRODUCTS.EFFECT_PACK_2,
];

class IAPService {
  private initialized = false;
  private products: Product[] = [];

  /**
   * Initialize IAP service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await RNIap.initConnection();
      console.log('✓ IAP connection initialized');

      // Setup purchase listener
      const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
        async (purchase: ProductPurchase) => {
          console.log('Purchase received:', purchase);
          await this.handlePurchase(purchase);
        }
      );

      const purchaseErrorSubscription = RNIap.purchaseErrorListener(
        (error: PurchaseError) => {
          console.error('Purchase error:', error);
          this.handlePurchaseError(error);
        }
      );

      // Load products
      await this.loadProducts();

      // Restore purchases
      await this.restorePurchases();

      this.initialized = true;
    } catch (error) {
      console.error('❌ IAP initialization failed:', error);
      throw error;
    }
  }

  /**
   * Load available products
   */
  async loadProducts(): Promise<void> {
    try {
      const products = await RNIap.getProducts({skus: PRODUCT_IDS});
      const subscriptions = await RNIap.getSubscriptions({skus: SUBSCRIPTION_IDS});

      this.products = [...products, ...subscriptions];

      // Update store with products
      const {setProducts} = useStore.getState();
      setProducts(
        this.products.map(p => ({
          id: p.productId,
          title: p.title,
          description: p.description,
          price: p.localizedPrice,
          type: SUBSCRIPTION_IDS.includes(p.productId)
            ? 'subscription'
            : 'non-consumable',
          isPurchased: false,
        }))
      );

      console.log('✓ Products loaded:', this.products.length);
    } catch (error) {
      console.error('❌ Failed to load products:', error);
      throw error;
    }
  }

  /**
   * Purchase a product
   */
  async purchaseProduct(productId: string): Promise<void> {
    try {
      const {setLoading} = useStore.getState();
      setLoading(true);

      if (SUBSCRIPTION_IDS.includes(productId)) {
        await requestSubscription({sku: productId});
      } else {
        await requestPurchase({sku: productId});
      }
    } catch (error) {
      console.error('❌ Purchase failed:', error);
      const {setError} = useStore.getState();
      setError('Purchase failed. Please try again.');
      throw error;
    } finally {
      const {setLoading} = useStore.getState();
      setLoading(false);
    }
  }

  /**
   * Handle successful purchase
   */
  private async handlePurchase(purchase: ProductPurchase): Promise<void> {
    try {
      const {addPurchase} = useStore.getState();

      // Verify receipt (in production, verify with backend)
      const isValid = await this.verifyReceipt(purchase);

      if (isValid) {
        // Add purchase to store
        addPurchase(purchase.productId);

        // Finish transaction
        await finishTransaction({purchase, isConsumable: false});

        console.log('✓ Purchase successful:', purchase.productId);
      } else {
        console.error('❌ Receipt verification failed');
        throw new Error('Receipt verification failed');
      }
    } catch (error) {
      console.error('❌ Failed to handle purchase:', error);
      throw error;
    }
  }

  /**
   * Handle purchase error
   */
  private handlePurchaseError(error: PurchaseError): void {
    const {setError} = useStore.getState();

    if (error.code === 'E_USER_CANCELLED') {
      console.log('User cancelled purchase');
      return;
    }

    console.error('Purchase error:', error);
    setError(error.message || 'An error occurred during purchase');
  }

  /**
   * Verify receipt
   * In production, this should verify with Apple/Google servers or your backend
   */
  private async verifyReceipt(purchase: ProductPurchase): Promise<boolean> {
    // For offline app, we trust the purchase
    // In production with backend, verify receipt here
    return true;
  }

  /**
   * Restore purchases
   */
  async restorePurchases(): Promise<void> {
    try {
      const {setLoading, addPurchase} = useStore.getState();
      setLoading(true);

      console.log('Restoring purchases...');

      const purchases = await RNIap.getAvailablePurchases();

      for (const purchase of purchases) {
        const isValid = await this.verifyReceipt(purchase);
        if (isValid) {
          addPurchase(purchase.productId);
          console.log('✓ Restored purchase:', purchase.productId);
        }
      }

      console.log('✓ Purchases restored:', purchases.length);
    } catch (error) {
      console.error('❌ Failed to restore purchases:', error);
      throw error;
    } finally {
      const {setLoading} = useStore.getState();
      setLoading(false);
    }
  }

  /**
   * Check if user has purchased a product
   */
  async hasPurchased(productId: string): Promise<boolean> {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      return purchases.some(p => p.productId === productId);
    } catch (error) {
      console.error('Failed to check purchase:', error);
      return false;
    }
  }

  /**
   * Check if user has Pro
   */
  async isPro(): Promise<boolean> {
    const hasLifetime = await this.hasPurchased(IAP_PRODUCTS.PRO_LIFETIME);
    const hasMonthly = await this.hasPurchased(IAP_PRODUCTS.PRO_MONTHLY);
    const hasYearly = await this.hasPurchased(IAP_PRODUCTS.PRO_YEARLY);

    return hasLifetime || hasMonthly || hasYearly;
  }

  /**
   * Get product by ID
   */
  getProduct(productId: string): Product | undefined {
    return this.products.find(p => p.productId === productId);
  }

  /**
   * Get all products
   */
  getAllProducts(): Product[] {
    return this.products;
  }

  /**
   * End connection (cleanup)
   */
  async endConnection(): Promise<void> {
    try {
      await RNIap.endConnection();
      this.initialized = false;
      console.log('✓ IAP connection closed');
    } catch (error) {
      console.error('Failed to end IAP connection:', error);
    }
  }
}

export const iapService = new IAPService();

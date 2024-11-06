import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './sanity.types';

export interface BasketItem {
  product: Product;
  quantity: number;
}

interface BasketState {
  items: BasketItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  removeItemCompletely: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearBasket: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => BasketItem[];
  isItemInBasket: (productId: string) => boolean;
  getBasketSummary: () => {
    totalItems: number;
    totalPrice: number;
    uniqueItems: number;
  };
}

const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        if (quantity < 1) return;
        
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.product._id === productId) {
              const newQuantity = Math.max(0, item.quantity - 1);
              return { ...item, quantity: newQuantity };
            }
            return item;
          }).filter((item) => item.quantity > 0);

          return { items: updatedItems };
        });
      },

      removeItemCompletely: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        }));
      },

      updateItemQuantity: (productId, quantity) => {
        if (quantity < 0) return;

        set((state) => {
          if (quantity === 0) {
            return {
              items: state.items.filter((item) => item.product._id !== productId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.product._id === productId
                ? { ...item, quantity }
                : item
            ),
          };
        });
      },

      clearBasket: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price * item.quantity),
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product._id === productId);
        return item?.quantity ?? 0;
      },

      getGroupedItems: () => get().items,

      isItemInBasket: (productId) => {
        return get().items.some((item) => item.product._id === productId);
      },

      getBasketSummary: () => ({
        totalItems: get().getTotalItems(),
        totalPrice: get().getTotalPrice(),
        uniqueItems: get().items.length,
      }),
    }),
    {
      name: 'basket-storage',
      getStorage: () => localStorage,
      version: 1, // Added version for future migrations
    }
  )
);

// Optional: Add TypeScript helper for accessing the store
export type BasketStore = ReturnType<typeof useBasketStore>;

export default useBasketStore;
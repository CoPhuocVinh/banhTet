import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProductWithPrices } from "@/lib/api/products";

export interface CartItem {
  product: ProductWithPrices;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  deliveryDate: string | null; // ISO date string
  deliveryTierId: string | null;
}

interface CartActions {
  addItem: (product: ProductWithPrices, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setDeliveryDate: (date: string | null, tierId: string | null) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getItem: (productId: string) => CartItem | undefined;
}

type CartStore = CartState & CartActions;

const initialState: CartState = {
  items: [],
  deliveryDate: null,
  deliveryTierId: null,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (product: ProductWithPrices, quantity: number = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingIndex >= 0) {
            // Update quantity if item exists
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: Math.min(
                99,
                newItems[existingIndex].quantity + quantity
              ),
            };
            return { items: newItems };
          }

          // Add new item
          return {
            items: [...state.items, { product, quantity: Math.min(99, quantity) }],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(99, Math.max(1, quantity)) }
              : item
          ),
        }));
      },

      setDeliveryDate: (date: string | null, tierId: string | null) => {
        set({ deliveryDate: date, deliveryTierId: tierId });
      },

      clearCart: () => {
        set(initialState);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getItem: (productId: string) => {
        return get().items.find((item) => item.product.id === productId);
      },
    }),
    {
      name: "banhtet-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        deliveryDate: state.deliveryDate,
        deliveryTierId: state.deliveryTierId,
      }),
    }
  )
);

// Selector hooks for better performance
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartItemCount = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
export const useDeliveryDate = () =>
  useCartStore((state) => ({
    date: state.deliveryDate,
    tierId: state.deliveryTierId,
  }));

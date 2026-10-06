import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, CartStore } from '@/types/cart';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItemData) => {
        const { items } = get();

        // Generamos un identificador unívoco basado en el producto, la variación y los atributos
        const attrKey = newItemData.selectedAttributes
          ? newItemData.selectedAttributes.map((a) => `${a.name}:${a.option}`).sort().join('|')
          : '';
        const uniqueId = `${newItemData.productId}-${newItemData.variationId || 0}-${attrKey}`;

        const existingIndex = items.findIndex((i) => i.id === uniqueId);
        const addQty = newItemData.quantity || 1;

        if (existingIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingIndex].quantity += addQty;
          set({ items: updatedItems, isOpen: true });
        } else {
          const newItem: CartItem = {
            ...newItemData,
            id: uniqueId,
            quantity: addQty,
          };
          set({ items: [...items, newItem], isOpen: true });
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'maxlevel-cart-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

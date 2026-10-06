export interface SelectedAttribute {
  name: string;   // ej: "Sabor"
  option: string; // ej: "Chocolate Suizo"
}

export interface CartItem {
  id: string;               // Hash único (productId + variationId + atributos seleccionados)
  productId: number;        // ID de WooCommerce
  variationId?: number;     // ID de variación si aplica
  name: string;
  slug: string;
  price: number;
  regularPrice?: number;
  image: string;
  quantity: number;
  selectedAttributes?: SelectedAttribute[];
  isCombo?: boolean;
  comboItemsSummary?: string[];
}

export interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface WCProductImage {
  id: number;
  src: string;
  name?: string;
  alt?: string;
}

export interface WCProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WCProductAttribute {
  id: number;
  name: string; // ej: "Sabor", "Tamaño"
  position?: number;
  visible?: boolean;
  variation?: boolean;
  options: string[]; // ej: ["Chocolate Suizo", "Vainilla", "Frutos Rojos"]
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink?: string;
  type: 'simple' | 'variable' | 'grouped';
  status: 'publish' | 'draft';
  featured: boolean;
  description: string;
  short_description: string;
  sku?: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  stock_quantity: number | null;
  in_stock: boolean;
  categories: WCProductCategory[];
  images: WCProductImage[];
  attributes: WCProductAttribute[];
  variations?: number[];
  grouped_products?: number[];
  brand?: string;
  servings?: number;
  benefits?: string[];
  isCombo?: boolean;
  comboItems?: string[];
  discountPercentage?: number;
}

export interface WCProductVariation {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  in_stock: boolean;
  stock_quantity: number | null;
  attributes: {
    id: number;
    name: string;
    option: string;
  }[];
  image?: WCProductImage;
}

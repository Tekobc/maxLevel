import { CartItem } from './cart';

export interface CustomerShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryMethod: 'shipping' | 'pickup';
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  notes?: string;
}

export interface CreateOrderPayload {
  customer: CustomerShippingData;
  items: CartItem[];
  paymentMethod: 'mercadopago' | 'whatsapp';
}

export interface MercadoPagoPreferenceResponse {
  id: string;
  initPoint: string;
  sandboxInitPoint?: string;
  orderId?: number | string;
}

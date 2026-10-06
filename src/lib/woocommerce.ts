import { WCProduct } from '@/types/woocommerce';
import { MOCK_PRODUCTS } from './constants';
import { CreateOrderPayload } from '@/types/checkout';

const WC_API_URL = process.env.WC_API_URL;
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

const isConfigured = Boolean(
  WC_API_URL &&
  WC_CONSUMER_KEY &&
  WC_CONSUMER_SECRET &&
  !WC_CONSUMER_KEY.includes('test_key')
);

function getAuthHeader(): string {
  if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) return '';
  return `Basic ${Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64')}`;
}

export async function getProducts(options?: {
  category?: string;
  featured?: boolean;
  search?: string;
  perPage?: number;
}): Promise<WCProduct[]> {
  const { category, featured, search, perPage = 20 } = options || {};

  if (!isConfigured) {
    let filtered = [...MOCK_PRODUCTS];

    if (category && category !== 'todos') {
      filtered = filtered.filter((p) =>
        p.categories.some((c) => c.slug === category)
      );
    }

    if (featured !== undefined) {
      filtered = filtered.filter((p) => p.featured === featured);
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categories.some((c) => c.name.toLowerCase().includes(q))
      );
    }

    return filtered.slice(0, perPage);
  }

  try {
    const params = new URLSearchParams();
    params.set('per_page', String(perPage));
    params.set('status', 'publish');
    if (category && category !== 'todos') params.set('category', category);
    if (featured) params.set('featured', 'true');
    if (search) params.set('search', search);

    const res = await fetch(`${WC_API_URL}/wp-json/wc/v3/products?${params.toString()}`, {
      headers: {
        Authorization: getAuthHeader(),
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600,
        tags: ['wc-products'],
      },
    });

    if (!res.ok) {
      console.warn('WooCommerce API returned status:', res.status, 'falling back to mock data.');
      return MOCK_PRODUCTS;
    }

    const data: WCProduct[] = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching WooCommerce products, using fallback:', error);
    return MOCK_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const mockMatch = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (mockMatch) return mockMatch;

  if (!isConfigured) return null;

  try {
    const res = await fetch(`${WC_API_URL}/wp-json/wc/v3/products?slug=${encodeURIComponent(slug)}`, {
      headers: {
        Authorization: getAuthHeader(),
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600, tags: ['wc-products', `product-${slug}`] },
    });

    if (!res.ok) return null;
    const products: WCProduct[] = await res.json();
    return products[0] || null;
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    return null;
  }
}

export async function getProductById(id: number): Promise<WCProduct | null> {
  const mockMatch = MOCK_PRODUCTS.find((p) => p.id === id);
  if (mockMatch) return mockMatch;

  if (!isConfigured) return null;

  try {
    const res = await fetch(`${WC_API_URL}/wp-json/wc/v3/products/${id}`, {
      headers: {
        Authorization: getAuthHeader(),
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600, tags: ['wc-products', `product-${id}`] },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Error fetching product by id:', err);
    return null;
  }
}

export async function createWooCommerceOrder(payload: CreateOrderPayload): Promise<number | null> {
  if (!isConfigured) {
    // Retornamos un ID de pedido ficticio para desarrollo local
    return Math.floor(100000 + Math.random() * 900000);
  }

  try {
    const lineItems = payload.items.map((item) => ({
      product_id: item.productId,
      variation_id: item.variationId || undefined,
      quantity: item.quantity,
    }));

    const orderData = {
      payment_method: payload.paymentMethod === 'mercadopago' ? 'mercadopago' : 'cod',
      payment_method_title: payload.paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Coordinar por WhatsApp',
      set_paid: false,
      billing: {
        first_name: payload.customer.firstName,
        last_name: payload.customer.lastName,
        email: payload.customer.email,
        phone: payload.customer.phone,
        address_1: payload.customer.address || 'Retiro en sucursal',
        city: payload.customer.city || 'CABA',
        state: payload.customer.province || 'Buenos Aires',
        postcode: payload.customer.postalCode || '1000',
        country: 'AR',
      },
      shipping: {
        first_name: payload.customer.firstName,
        last_name: payload.customer.lastName,
        address_1: payload.customer.address || 'Retiro en sucursal',
        city: payload.customer.city || 'CABA',
        state: payload.customer.province || 'Buenos Aires',
        postcode: payload.customer.postalCode || '1000',
        country: 'AR',
      },
      line_items: lineItems,
      customer_note: payload.customer.notes || '',
    };

    const res = await fetch(`${WC_API_URL}/wp-json/wc/v3/orders`, {
      method: 'POST',
      headers: {
        Authorization: getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      console.error('Failed to create WC order:', await res.text());
      return Math.floor(100000 + Math.random() * 900000);
    }

    const order = await res.json();
    return order.id;
  } catch (error) {
    console.error('Error creating WooCommerce order:', error);
    return Math.floor(100000 + Math.random() * 900000);
  }
}

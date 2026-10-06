import { MercadoPagoConfig, Preference } from 'mercadopago';
import { CartItem } from '@/types/cart';
import { CustomerShippingData } from '@/types/checkout';

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const isMpConfigured = Boolean(
  MP_ACCESS_TOKEN && !MP_ACCESS_TOKEN.includes('test-token-sample')
);

export async function createPreference(
  items: CartItem[],
  customer: CustomerShippingData,
  orderId: number | string
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!isMpConfigured) {
    // Si aún no está cargado el token real de producción/sandbox, devolvemos una URL simulada o de éxito
    return {
      id: `pref_mock_${Date.now()}`,
      initPoint: `${siteUrl}/checkout/resultado?status=approved&collection_id=demo_${Date.now()}&order_id=${orderId}`,
      sandboxInitPoint: `${siteUrl}/checkout/resultado?status=approved&collection_id=demo_${Date.now()}&order_id=${orderId}`,
    };
  }

  const client = new MercadoPagoConfig({
    accessToken: MP_ACCESS_TOKEN!,
  });

  const preference = new Preference(client);

  const preferenceItems = items.map((item) => ({
    id: String(item.productId),
    title: item.name,
    description: item.comboItemsSummary ? item.comboItemsSummary.join(' + ') : item.name,
    picture_url: item.image,
    quantity: item.quantity,
    unit_price: Number(item.price),
    currency_id: 'ARS',
  }));

  const response = await preference.create({
    body: {
      items: preferenceItems,
      payer: {
        name: customer.firstName,
        surname: customer.lastName,
        email: customer.email,
        phone: {
          number: customer.phone,
        },
        address: customer.address
          ? {
              street_name: customer.address,
              zip_code: customer.postalCode || '',
            }
          : undefined,
      },
      back_urls: {
        success: `${siteUrl}/checkout/resultado?status=approved&order_id=${orderId}`,
        pending: `${siteUrl}/checkout/resultado?status=pending&order_id=${orderId}`,
        failure: `${siteUrl}/checkout/resultado?status=failure&order_id=${orderId}`,
      },
      auto_return: 'approved',
      external_reference: String(orderId),
      statement_descriptor: 'MAX LEVEL SUPLE',
    },
  });

  return {
    id: response.id!,
    initPoint: response.init_point!,
    sandboxInitPoint: response.sandbox_init_point,
  };
}

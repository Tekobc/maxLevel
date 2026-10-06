import { NextRequest, NextResponse } from 'next/server';
import { createWooCommerceOrder } from '@/lib/woocommerce';
import { createPreference } from '@/lib/mercadopago';
import { CreateOrderPayload } from '@/types/checkout';

export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderPayload = await req.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'El carrito no contiene productos.' },
        { status: 400 }
      );
    }

    if (!body.customer || !body.customer.email || !body.customer.phone) {
      return NextResponse.json(
        { error: 'Faltan datos de contacto del cliente.' },
        { status: 400 }
      );
    }

    // 1. Crear el Pedido en WooCommerce (o mock orderId si aún no está configurado)
    const orderId = await createWooCommerceOrder(body);

    if (!orderId) {
      return NextResponse.json(
        { error: 'No se pudo generar el pedido en la tienda.' },
        { status: 500 }
      );
    }

    // 2. Crear Preferencia en Mercado Pago
    const preference = await createPreference(body.items, body.customer, orderId);

    return NextResponse.json({
      orderId,
      preferenceId: preference.id,
      initPoint: preference.initPoint,
      sandboxInitPoint: preference.sandboxInitPoint,
    });
  } catch (error: any) {
    console.error('Error en /api/checkout/mercadopago:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}

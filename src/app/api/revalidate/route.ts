import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');

    // Valida el secreto para proteger contra llamadas no autorizadas
    if (secret !== process.env.WC_WEBHOOK_SECRET) {
      return NextResponse.json({ message: 'Token de webhook inválido' }, { status: 401 });
    }

    // Invalida la caché incremental de productos de WooCommerce
    revalidateTag('wc-products');

    return NextResponse.json({
      revalidated: true,
      message: 'Caché de productos invalidada correctamente.',
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: 'Error invalidando caché', error: err.message },
      { status: 500 }
    );
  }
}

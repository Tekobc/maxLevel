import React from 'react';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finalizar Compra — MAX LEVEL Suplementos',
  description: 'Checkout rápido y seguro sin contraseñas. Pagá con Mercado Pago o coordiná por WhatsApp.',
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight text-white uppercase">
          CHECKOUT <span className="text-brand-neon">EXPRESS</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Completá tus datos para despacho o retiro en un solo paso.
        </p>
      </div>

      <CheckoutForm />
    </div>
  );
}

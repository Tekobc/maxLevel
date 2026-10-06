'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Truck, Store, CreditCard, MessageCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { CustomerShippingData } from '@/types/checkout';
import { formatCurrency, generateWhatsAppOrderUrl } from '@/lib/utils';
import { STORE_CONFIG } from '@/lib/constants';
import { toast } from 'sonner';

export default function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const totalPrice = getTotalPrice();

  const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'pickup'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'whatsapp'>('mercadopago');
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: 'Buenos Aires',
    postalCode: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Por favor completa todos tus datos personales.');
      return;
    }

    if (deliveryMethod === 'shipping' && (!formData.address || !formData.city)) {
      toast.error('Por favor ingresa la dirección de entrega.');
      return;
    }

    const customerData: CustomerShippingData = {
      ...formData,
      deliveryMethod,
    };

    if (paymentMethod === 'whatsapp') {
      const whatsappUrl = generateWhatsAppOrderUrl(
        STORE_CONFIG.whatsappPhone,
        items,
        totalPrice,
        customerData
      );
      toast.success('¡Redirigiendo a WhatsApp para confirmar tu pedido!');
      clearCart();
      window.open(whatsappUrl, '_blank');
      router.push('/checkout/resultado?status=whatsapp_pending');
      return;
    }

    // Mercado Pago Flow
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerData,
          items,
          paymentMethod: 'mercadopago',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar pago con Mercado Pago');
      }

      toast.success('¡Redirigiendo a Mercado Pago!');
      clearCart();

      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        router.push('/checkout/resultado?status=approved');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Ocurrió un error al procesar el pago.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center py-16">
        <h2 className="text-2xl font-black text-white uppercase">Tu carrito está vacío</h2>
        <p className="mt-2 text-sm text-zinc-400">
          No tienes productos seleccionados para finalizar el pedido.
        </p>
        <button
          onClick={() => router.push('/productos')}
          className="mt-6 rounded-xl bg-brand-neon px-6 py-3 text-xs font-black uppercase text-black"
        >
          Ir al catálogo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Columna Izquierda: Datos y Opciones */}
      <div className="lg:col-span-7 space-y-6">
        {/* 1. Datos Personales */}
        <div className="rounded-3xl border border-surface-border bg-surface p-6">
          <h3 className="text-base font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-neon text-black text-xs font-black">1</span>
            Tus Datos Personales (Sin Contraseñas)
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Nombre *</label>
              <input
                required
                type="text"
                name="firstName"
                placeholder="Ej: Marcos"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-neon focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Apellido *</label>
              <input
                required
                type="text"
                name="lastName"
                placeholder="Ej: González"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-neon focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">WhatsApp / Teléfono *</label>
              <input
                required
                type="tel"
                name="phone"
                placeholder="Ej: 11 2345 6789"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-neon focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Email (para el recibo) *</label>
              <input
                required
                type="email"
                name="email"
                placeholder="Ej: tuemail@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-neon focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Método de Entrega */}
        <div className="rounded-3xl border border-surface-border bg-surface p-6">
          <h3 className="text-base font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-neon text-black text-xs font-black">2</span>
            Forma de Entrega
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setDeliveryMethod('shipping')}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                deliveryMethod === 'shipping'
                  ? 'border-brand-neon bg-brand-neon/10'
                  : 'border-surface-border bg-surface-elevated text-zinc-400'
              }`}
            >
              <Truck className={`h-5 w-5 mt-0.5 ${deliveryMethod === 'shipping' ? 'text-brand-neon' : 'text-zinc-400'}`} />
              <div>
                <span className="block text-sm font-bold text-white">Envío a Domicilio</span>
                <span className="text-xs text-zinc-400">Todo el país vía Andreani / Correo</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryMethod('pickup')}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                deliveryMethod === 'pickup'
                  ? 'border-brand-neon bg-brand-neon/10'
                  : 'border-surface-border bg-surface-elevated text-zinc-400'
              }`}
            >
              <Store className={`h-5 w-5 mt-0.5 ${deliveryMethod === 'pickup' ? 'text-brand-neon' : 'text-zinc-400'}`} />
              <div>
                <span className="block text-sm font-bold text-white">Retiro en Sucursal</span>
                <span className="text-xs text-zinc-400">Gratis en Almagro, CABA</span>
              </div>
            </button>
          </div>

          {deliveryMethod === 'shipping' && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4 border-t border-surface-border">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Calle y Altura *</label>
                <input
                  required
                  type="text"
                  name="address"
                  placeholder="Ej: Av. Santa Fe 1234, Piso 4 B"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-neon focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Ciudad / Localidad *</label>
                <input
                  required
                  type="text"
                  name="city"
                  placeholder="Ej: CABA / Rosario"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-neon focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Código Postal</label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Ej: 1425"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-neon focus:outline-none"
                />
              </div>
            </div>
          )}

          {deliveryMethod === 'pickup' && (
            <div className="mt-4 rounded-xl bg-surface-elevated p-3 text-xs text-zinc-300">
              📍 <strong>Punto de entrega:</strong> {STORE_CONFIG.pickupAddress} ({STORE_CONFIG.pickupHours}). Podés retirar apenas se confirme el pedido.
            </div>
          )}
        </div>

        {/* 3. Forma de Pago */}
        <div className="rounded-3xl border border-surface-border bg-surface p-6">
          <h3 className="text-base font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-neon text-black text-xs font-black">3</span>
            Método de Pago
          </h3>

          <div className="space-y-3">
            <label
              onClick={() => setPaymentMethod('mercadopago')}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                paymentMethod === 'mercadopago'
                  ? 'border-brand-neon bg-brand-neon/10'
                  : 'border-surface-border bg-surface-elevated'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-brand-neon" />
                <div>
                  <span className="block text-sm font-bold text-white">Mercado Pago</span>
                  <span className="text-xs text-zinc-400">Tarjetas de crédito/débito, dinero en cuenta, Rapipago</span>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'mercadopago'}
                onChange={() => setPaymentMethod('mercadopago')}
                className="h-4 w-4 accent-brand-neon"
              />
            </label>

            <label
              onClick={() => setPaymentMethod('whatsapp')}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                paymentMethod === 'whatsapp'
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-surface-border bg-surface-elevated'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-emerald-400" />
                <div>
                  <span className="block text-sm font-bold text-white">Coordinar por WhatsApp</span>
                  <span className="text-xs text-zinc-400">Efectivo contra entrega o transferencia bancaria</span>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'whatsapp'}
                onChange={() => setPaymentMethod('whatsapp')}
                className="h-4 w-4 accent-emerald-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Resumen de Compra */}
      <div className="lg:col-span-5">
        <div className="sticky top-28 rounded-3xl border border-surface-border bg-surface p-6 shadow-xl">
          <h3 className="text-base font-black text-white uppercase tracking-wider mb-4">
            Resumen de tu Pedido
          </h3>

          <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-elevated">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="line-clamp-1 font-bold text-white">{item.name}</span>
                    <span className="text-zinc-400">Cant: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-white">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-surface-border pt-4 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span className="font-semibold text-white">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Envío</span>
              <span className="font-semibold text-emerald-400">
                {deliveryMethod === 'pickup' || totalPrice >= STORE_CONFIG.freeShippingThreshold
                  ? '¡GRATIS!'
                  : 'A coordinar'}
              </span>
            </div>
            <div className="flex justify-between border-t border-surface-border pt-3 text-lg font-black text-white">
              <span>Total a Pagar</span>
              <span className="text-brand-neon">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-neon py-4 text-sm font-black uppercase tracking-wider text-black shadow-neon-glow transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>PROCESANDO...</span>
              </>
            ) : paymentMethod === 'mercadopago' ? (
              <span>PAGAR CON MERCADO PAGO</span>
            ) : (
              <span>ENVIAR PEDIDO POR WHATSAPP</span>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Compra protegida y despacho seguro</span>
          </div>
        </div>
      </div>
    </form>
  );
}

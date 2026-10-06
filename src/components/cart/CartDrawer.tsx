'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageCircle, Truck, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency, generateWhatsAppOrderUrl } from '@/lib/utils';
import { STORE_CONFIG } from '@/lib/constants';

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isOpen) return null;

  const totalPrice = getTotalPrice();
  const freeShippingThreshold = STORE_CONFIG.freeShippingThreshold;
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);
  const progressPercent = Math.min(100, Math.round((totalPrice / freeShippingThreshold) * 100));

  const whatsappOrderUrl = generateWhatsAppOrderUrl(
    STORE_CONFIG.whatsappPhone,
    items,
    totalPrice
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop oscuro con blur */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-surface-border bg-surface shadow-2xl flex flex-col justify-between">
          {/* Header del Carrito */}
          <div className="border-b border-surface-border p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand-neon" />
                <h2 className="text-base font-black uppercase text-white tracking-wider">
                  Tu Carrito ({getTotalItems})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-border text-zinc-400 hover:text-white"
                aria-label="Cerrar carrito"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Barra de Envío Gratis */}
            <div className="mt-4 rounded-xl border border-surface-border/70 bg-surface-elevated p-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Truck className="h-4 w-4 text-brand-neon" />
                  {missingForFreeShipping === 0 ? (
                    <span className="text-brand-neon flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> ¡TENÉS ENVÍO GRATIS!
                    </span>
                  ) : (
                    <span>
                      Sumá <strong className="text-brand-neon">{formatCurrency(missingForFreeShipping)}</strong> para envío gratis
                    </span>
                  )}
                </span>
                <span className="text-zinc-400">{progressPercent}%</span>
              </div>
              {/* Barra de progreso */}
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-border">
                <div
                  className="h-full bg-brand-neon transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lista de Productos */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated text-zinc-500 mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-white uppercase">Tu carrito está vacío</h3>
                <p className="mt-1 max-w-xs text-xs text-zinc-400">
                  Aprovechá los combos con descuento y sumá tu suplementación favorita.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-5 rounded-xl bg-brand-neon px-5 py-2.5 text-xs font-black uppercase text-black"
                >
                  Ver Suplementos
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-surface-border bg-surface-elevated p-3"
                >
                  {/* Foto de Producto */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-background">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Datos del Producto */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="line-clamp-2 text-xs font-bold text-white">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-500 hover:text-red-400 transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Atributos seleccionados */}
                      {item.selectedAttributes && item.selectedAttributes.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {item.selectedAttributes.map((attr, idx) => (
                            <span key={idx} className="block text-[11px] text-brand-neon">
                              {attr.name}: {attr.option}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Precios y Cantidad */}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-black text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </span>

                      <div className="flex items-center rounded-lg border border-surface-border bg-background">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-zinc-400 hover:text-white"
                          aria-label="Disminuir"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center text-zinc-400 hover:text-white"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer del Carrito con Acciones */}
          {items.length > 0 && (
            <div className="border-t border-surface-border bg-surface-elevated/60 p-4 sm:p-5">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Envío</span>
                  <span className="font-semibold text-emerald-400">
                    {missingForFreeShipping === 0 ? '¡GRATIS!' : 'A calcular'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-surface-border pt-2 text-base font-black text-white">
                  <span>Total</span>
                  <span className="text-brand-neon">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {/* Botones de Conversión */}
              <div className="mt-4 space-y-2.5">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-neon py-3.5 text-xs sm:text-sm font-black uppercase text-black shadow-neon-glow transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>INICIAR CHECKOUT EXPRESS</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-500/50 bg-emerald-500/10 py-3 text-xs sm:text-sm font-bold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Pedir directamente por WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';

export default function FloatingCartButton() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || totalItems === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-8 sm:right-8">
      <button
        onClick={openCart}
        className="group relative flex items-center gap-3 rounded-full bg-brand-neon px-5 py-3.5 text-black shadow-neon-glow transition-all hover:scale-105 active:scale-95"
        aria-label="Ver carrito de compras"
      >
        <div className="relative">
          <ShoppingBag className="h-6 w-6 stroke-[2.5]" />
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] font-black text-brand-neon">
            {totalItems}
          </span>
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[11px] font-black tracking-wider uppercase text-black/80">
            Ver Carrito
          </span>
          <span className="text-sm font-black text-black">
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </button>
    </div>
  );
}

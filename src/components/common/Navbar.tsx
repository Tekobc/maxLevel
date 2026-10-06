'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Zap, Flame, MessageCircle, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { STORE_CONFIG } from '@/lib/constants';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const openCart = useCartStore((state) => state.openCart);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-background/90 backdrop-blur-md transition-all">
      {/* Top Banner Oferta / Envío Gratis */}
      <div className="bg-brand-neon px-4 py-1.5 text-center text-xs font-black tracking-wider text-black uppercase">
        ⚡ ENVÍO GRATIS EN COMPRAS MAYORES A $50.000 ⚡ 3 CUOTAS SIN INTERÉS
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-neon text-black shadow-neon-sm transition-transform group-hover:scale-105">
            <Zap className="h-6 w-6 fill-black stroke-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black italic tracking-tighter text-white uppercase sm:text-2xl">
              MAX <span className="text-brand-neon">LEVEL</span>
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">
              SUPLEMENTOS FITNESS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-semibold tracking-wide text-zinc-300 transition-colors hover:text-brand-neon"
          >
            Inicio
          </Link>
          <Link
            href="/#combos"
            className="flex items-center gap-1.5 text-sm font-bold tracking-wide text-brand-neon transition-all hover:scale-105"
          >
            <Flame className="h-4 w-4 fill-brand-neon" />
            Combos Express
          </Link>
          <Link
            href="/productos"
            className="text-sm font-semibold tracking-wide text-zinc-300 transition-colors hover:text-brand-neon"
          >
            Catálogo Completo
          </Link>
          <a
            href={`https://wa.me/${STORE_CONFIG.whatsappPhone}?text=${encodeURIComponent('¡Hola Max Level! Quiero hacer una consulta sobre suplementación.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Asesor
          </a>
        </nav>

        {/* Acciones: Carrito y Menú Móvil */}
        <div className="flex items-center gap-3">
          {/* Botón Carrito */}
          <button
            onClick={openCart}
            aria-label="Abrir carrito"
            className="relative flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3.5 py-2 transition-all hover:border-brand-neon/60 hover:bg-surface-elevated active:scale-95"
          >
            <ShoppingBag className="h-5 w-5 text-brand-neon" />
            <span className="hidden text-xs font-bold text-white uppercase sm:inline">
              Carrito
            </span>
            {mounted && totalItems > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-neon text-[11px] font-black text-black shadow-neon-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* Botón Hamburguesa Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface text-zinc-300 md:hidden"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="border-b border-surface-border bg-surface px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-bold text-white hover:bg-surface-elevated"
            >
              🔥 Inicio
            </Link>
            <Link
              href="/#combos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-brand-neon/10 px-3 py-2 text-base font-black text-brand-neon"
            >
              <Zap className="h-4 w-4 fill-brand-neon" />
              Combos Express (Instagram)
            </Link>
            <Link
              href="/productos"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-bold text-white hover:bg-surface-elevated"
            >
              📦 Catálogo Completo
            </Link>
            <a
              href={`https://wa.me/${STORE_CONFIG.whatsappPhone}?text=${encodeURIComponent('¡Hola Max Level! Quiero hacer una consulta sobre suplementación.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-bold text-emerald-400 hover:bg-surface-elevated"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Oficial
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, Zap, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { WCProduct } from '@/types/woocommerce';
import { formatCurrency } from '@/lib/utils';
import ComboModal from './ComboModal';

interface ComboHeroProps {
  featuredCombo: WCProduct;
}

export default function ComboHero({ featuredCombo }: ComboHeroProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section id="combos" className="relative overflow-hidden rounded-3xl border border-brand-neon/30 bg-gradient-to-br from-surface to-surface-elevated p-6 sm:p-10 shadow-2xl">
        {/* Glow de fondo */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-neon/10 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Contenido / Copy */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-brand-neon px-3 py-1 text-xs font-black tracking-wider text-black uppercase shadow-neon-sm">
                <Flame className="h-4 w-4 fill-black" />
                COMBO MÁS VENDIDO DE INSTAGRAM
              </span>
              <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-black tracking-wider text-white uppercase">
                -20% OFF
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black italic tracking-tighter text-white uppercase sm:text-5xl leading-none">
              COMBO VOLUMEN <span className="text-brand-neon">EXTREMO</span>
            </h1>

            <p className="mt-3 text-sm text-zinc-300 sm:text-base leading-relaxed">
              La combinación perfecta para ganar fuerza y masa muscular limpia: 
              <strong className="text-white"> 1kg Ultra Whey Isolate + Creatina Creapure® 300g</strong>, más un <strong className="text-brand-neon">Shaker Pro de Regalo</strong>.
            </p>

            {/* Bullets de lo que incluye */}
            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-neon/20 text-brand-neon text-xs font-black">✓</span>
                Proteína 100% Pura (25g Proteína / Scoop)
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-neon/20 text-brand-neon text-xs font-black">✓</span>
                Creatina Sello Creapure® Alemana
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-neon/20 text-brand-neon text-xs font-black">✓</span>
                Vaso Shaker Hermético Antigrumos
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-neon/20 text-brand-neon text-xs font-black">✓</span>
                Envío Rápido a Domicilio
              </div>
            </div>

            {/* Precios y CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-5">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {formatCurrency(featuredCombo.price)}
                  </span>
                  <span className="text-base font-bold text-zinc-500 line-through">
                    {formatCurrency(featuredCombo.regular_price)}
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-400">
                  ⚡ 3 Cuotas sin interés de {formatCurrency(parseFloat(featuredCombo.price) / 3)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-brand-neon px-6 py-4 text-xs sm:text-sm font-black tracking-wider text-black uppercase shadow-neon-glow transition-all hover:scale-105 active:scale-95"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>PEDIR ESTE COMBO</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Imagen destacada del Combo */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-surface-border bg-surface lg:col-span-5">
            <Image
              src={featuredCombo.images[0]?.src || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80'}
              alt={featuredCombo.name}
              fill
              priority
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/70 p-3 backdrop-blur-md text-center">
              <span className="text-xs font-bold text-white uppercase flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-neon" />
                Stock disponible para despacho inmediato
              </span>
            </div>
          </div>
        </div>
      </section>

      {modalOpen && (
        <ComboModal
          combo={featuredCombo}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

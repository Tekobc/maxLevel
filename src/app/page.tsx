import React, { Suspense } from 'react';
import { getProducts } from '@/lib/woocommerce';
import ComboHero from '@/components/combos/ComboHero';
import ProductGrid from '@/components/catalog/ProductGrid';
import ComboUrlParamListener from '@/components/combos/ComboUrlParamListener';
import { Zap, ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { STORE_CONFIG } from '@/lib/constants';

export const revalidate = 3600;

export default async function HomePage() {
  const products = await getProducts({ perPage: 40 });
  const featuredCombo = products.find((p) => p.isCombo) || products[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 space-y-12 sm:space-y-16">
      {/* Listener silencioso para deep-links de Instagram ?combo=ID */}
      <Suspense fallback={null}>
        <ComboUrlParamListener products={products} />
      </Suspense>

      {/* Hero del Combo Principal */}
      {featuredCombo && <ComboHero featuredCombo={featuredCombo} />}

      {/* Barra de Beneficios Deportivos */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface p-3.5 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-neon/15 text-brand-neon">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase">Envíos Rápidos</h4>
            <p className="text-[11px] text-zinc-400">Despacho en 24hs</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface p-3.5 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-neon/15 text-brand-neon">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase">100% Original</h4>
            <p className="text-[11px] text-zinc-400">Sellos de fábrica</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface p-3.5 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-neon/15 text-brand-neon">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase">Combos Express</h4>
            <p className="text-[11px] text-zinc-400">Precios por mayor</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface p-3.5 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase">Asesoramiento</h4>
            <p className="text-[11px] text-zinc-400">Atención WhatsApp</p>
          </div>
        </div>
      </div>

      {/* Catálogo Interactivo Completo */}
      <ProductGrid
        initialProducts={products}
        title="⚡ CATÁLOGO & COMBOS DISPONIBLES"
        subtitle="Agregá tus suplementos al carrito o elegí un combo con descuento y llevátelo sin vueltas."
      />

      {/* Banner de Contacto WhatsApp */}
      <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-gradient-to-r from-emerald-950/40 via-surface to-surface p-6 sm:p-10">
        <div className="max-w-2xl">
          <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
            ¿DUDAS SOBRE QUÉ TOMAR?
          </span>
          <h3 className="mt-2 text-2xl sm:text-3xl font-black italic tracking-tight text-white uppercase">
            HABLÁ DIRECTO CON NUESTROS ASESORES FITNESS
          </h3>
          <p className="mt-2 text-sm text-zinc-300">
            Te armamos un combo personalizado según tus objetivos: ganar masa muscular, definir o rendir más en tus entrenamientos.
          </p>
          <a
            href={`https://wa.me/${STORE_CONFIG.whatsappPhone}?text=${encodeURIComponent('Hola! Necesito asesoramiento para elegir mis suplementos.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-xs sm:text-sm font-black uppercase text-black transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chatear por WhatsApp Ahora</span>
          </a>
        </div>
      </div>
    </div>
  );
}

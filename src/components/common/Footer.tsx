import React from 'react';
import Link from 'next/link';
import { Zap, Instagram, MessageCircle, MapPin, Clock, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { STORE_CONFIG } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface/80 pt-12 pb-24 text-zinc-400 sm:pb-12">
      {/* 3 Pilares de Confianza */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 grid grid-cols-1 gap-6 border-b border-surface-border pb-12 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-surface-border/60 bg-background/50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-neon/10 text-brand-neon">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase">Envíos a Todo el País</h4>
              <p className="text-xs text-zinc-400">Despachos rápidos y seguimiento online</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-surface-border/60 bg-background/50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-neon/10 text-brand-neon">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase">100% Originales y Sellados</h4>
              <p className="text-xs text-zinc-400">Garantía de laboratorio y habilitación ANMAT</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-surface-border/60 bg-background/50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-neon/10 text-brand-neon">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase">Mercado Pago & Cuotas</h4>
              <p className="text-xs text-zinc-400">Tarjetas, transferencias y dinero en cuenta</p>
            </div>
          </div>
        </div>

        {/* Columnas Principales */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Info de Marca */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-neon text-black">
                <Zap className="h-5 w-5 fill-black stroke-black" />
              </div>
              <span className="text-xl font-black italic tracking-tighter text-white uppercase">
                MAX <span className="text-brand-neon">LEVEL</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm text-zinc-400 leading-relaxed">
              Tu tienda de suplementación deportiva de alto rendimiento. Encontrá las mejores marcas nacionales e importadas para potenciar tus entrenamientos y transformar tu físico.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={STORE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-background text-zinc-300 transition-colors hover:border-pink-500/50 hover:text-pink-400"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={`https://wa.me/${STORE_CONFIG.whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-background text-zinc-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navegación Rápida */}
          <div>
            <h4 className="text-xs font-black tracking-widest text-white uppercase">Secciones</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-neon transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/#combos" className="hover:text-brand-neon transition-colors">
                  Combos Express
                </Link>
              </li>
              <li>
                <Link href="/productos" className="hover:text-brand-neon transition-colors">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-brand-neon transition-colors">
                  Finalizar Compra
                </Link>
              </li>
            </ul>
          </div>

          {/* Punto de Retiro y Horarios */}
          <div>
            <h4 className="text-xs font-black tracking-widest text-white uppercase">Punto de Retiro</h4>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-brand-neon mt-0.5" />
                <span>{STORE_CONFIG.pickupAddress}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-brand-neon mt-0.5" />
                <span>{STORE_CONFIG.pickupHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-surface-border/60 pt-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} MAX LEVEL SUPLEMENTOS. Todos los derechos reservados. Desarrollado con Next.js Headless & WooCommerce.
        </div>
      </div>
    </footer>
  );
}

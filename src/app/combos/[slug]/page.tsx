import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/woocommerce';
import ProductDetailClient from '@/components/catalog/ProductDetailClient';
import { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const combo = await getProductBySlug(params.slug);
  if (!combo) return { title: 'Combo no encontrado — MAX LEVEL' };

  return {
    title: `🔥 ${combo.name} — MAX LEVEL Combos`,
    description: combo.short_description || combo.description,
  };
}

export default async function ComboLandingPage({ params }: Props) {
  const combo = await getProductBySlug(params.slug);

  if (!combo) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 rounded-2xl bg-brand-neon/10 border border-brand-neon/30 p-4 text-center">
        <span className="text-xs font-black uppercase tracking-wider text-brand-neon">
          🔥 OFERTA EXCLUSIVA DE REDES SOCIALES — PRECIO ESPECIAL POR TIEMPO LIMITADO
        </span>
      </div>

      <ProductDetailClient product={combo} />
    </div>
  );
}

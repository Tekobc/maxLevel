'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Check, Zap, Flame, ShieldCheck, Truck, MessageCircle, Minus, Plus } from 'lucide-react';
import { WCProduct } from '@/types/woocommerce';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { STORE_CONFIG } from '@/lib/constants';
import { toast } from 'sonner';

export default function ProductDetailClient({ product }: { product: WCProduct }) {
  const addItem = useCartStore((state) => state.addItem);

  const flavorAttr = product.attributes.find((a) =>
    a.name.toLowerCase().includes('sabor') || a.name.toLowerCase().includes('flavor')
  );

  const [selectedFlavor, setSelectedFlavor] = useState<string>(
    flavorAttr && flavorAttr.options.length > 0 ? flavorAttr.options[0] : ''
  );

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const selectedAttrs = selectedFlavor
      ? [{ name: flavorAttr?.name || 'Sabor', option: selectedFlavor }]
      : undefined;

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price),
      regularPrice: product.regular_price ? parseFloat(product.regular_price) : undefined,
      image: product.images[0]?.src || '/placeholders/supplement.jpg',
      selectedAttributes: selectedAttrs,
      isCombo: product.isCombo,
      comboItemsSummary: product.comboItems,
      quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);

    toast.success('¡Agregado al carrito!', {
      description: `${quantity}x ${product.name} ${selectedFlavor ? `(${selectedFlavor})` : ''}`,
    });
  };

  const hasDiscount = product.regular_price && parseFloat(product.regular_price) > parseFloat(product.price);
  const discountPercent = product.discountPercentage || (hasDiscount
    ? Math.round(
        ((parseFloat(product.regular_price) - parseFloat(product.price)) /
          parseFloat(product.regular_price)) *
          100
      )
    : 0);

  const whatsappInquiryUrl = `https://wa.me/${STORE_CONFIG.whatsappPhone}?text=${encodeURIComponent(
    `¡Hola Max Level! Estoy interesado en el producto: ${product.name} (${selectedFlavor || ''}). ¿Tienen stock disponible?`
  )}`;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Columna Izquierda: Imagen */}
      <div className="lg:col-span-6">
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-surface-border bg-surface">
          <Image
            src={product.images[0]?.src || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            fill
            priority
            className="object-cover"
          />

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isCombo && (
              <span className="flex items-center gap-1.5 rounded-full bg-brand-neon px-3 py-1 text-xs font-black text-black uppercase shadow-neon-sm">
                <Flame className="h-4 w-4 fill-black" />
                COMBO
              </span>
            )}
            {hasDiscount && (
              <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-black text-white uppercase shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Columna Derecha: Detalles, Sabores y Acciones */}
      <div className="lg:col-span-6 flex flex-col justify-between">
        <div>
          {/* Categoría y Marca */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest text-brand-neon uppercase">
              {product.categories[0]?.name || 'Suplementos'}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-semibold text-emerald-400">En Stock</span>
          </div>

          {/* Título */}
          <h1 className="mt-2 text-2xl font-black italic tracking-tight text-white uppercase sm:text-4xl leading-tight">
            {product.name}
          </h1>

          {/* Precios */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-black text-white">
              {formatCurrency(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-lg font-bold text-zinc-500 line-through">
                {formatCurrency(product.regular_price)}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
            {product.description || product.short_description}
          </p>

          {/* Si incluye items de combo */}
          {product.comboItems && (
            <div className="mt-5 rounded-2xl border border-surface-border bg-surface p-4">
              <span className="text-xs font-black uppercase text-brand-neon">
                📦 Contenido del pack:
              </span>
              <ul className="mt-2 space-y-1.5 text-xs text-zinc-200">
                {product.comboItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-brand-neon stroke-[3]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Selector de Sabor */}
          {flavorAttr && flavorAttr.options.length > 0 && (
            <div className="mt-6">
              <label className="block text-xs font-bold uppercase text-zinc-300 mb-2">
                Seleccioná tu sabor: <strong className="text-brand-neon">{selectedFlavor}</strong>
              </label>
              <div className="flex flex-wrap gap-2">
                {flavorAttr.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedFlavor(opt)}
                    className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                      selectedFlavor === opt
                        ? 'border-brand-neon bg-brand-neon text-black font-black shadow-neon-sm'
                        : 'border-surface-border bg-surface text-zinc-300 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cantidad y Botón de Compra */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex w-full sm:w-auto items-center justify-between rounded-xl border border-surface-border bg-surface p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center text-zinc-400 hover:text-white"
                aria-label="Menos"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center text-zinc-400 hover:text-white"
                aria-label="Más"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex w-full sm:flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 ${
                added
                  ? 'bg-emerald-500 text-white'
                  : 'bg-brand-neon text-black hover:scale-105 active:scale-95 shadow-neon-glow'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-5 w-5 stroke-[3]" />
                  <span>¡AGREGADO AL CARRITO!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  <span>AGREGAR AL CARRITO</span>
                </>
              )}
            </button>
          </div>

          {/* Botón WhatsApp */}
          <div className="mt-3">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 py-3 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Consultar disponibilidad por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Garantías */}
        <div className="mt-8 border-t border-surface-border pt-6 grid grid-cols-2 gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-brand-neon shrink-0" />
            <span>Envíos rápidos a todo el país</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-neon shrink-0" />
            <span>Producto 100% original cerrado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

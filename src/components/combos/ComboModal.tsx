'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Flame, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { WCProduct } from '@/types/woocommerce';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

interface ComboModalProps {
  combo: WCProduct;
  isOpen: boolean;
  onClose: () => void;
}

export default function ComboModal({ combo, isOpen, onClose }: ComboModalProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Atributos de sabor
  const flavorAttr = combo.attributes.find((a) =>
    a.name.toLowerCase().includes('sabor') || a.name.toLowerCase().includes('flavor')
  );

  const [selectedFlavor, setSelectedFlavor] = useState<string>(
    flavorAttr && flavorAttr.options.length > 0 ? flavorAttr.options[0] : ''
  );

  if (!isOpen) return null;

  const handleAddComboToCart = () => {
    const selectedAttrs = selectedFlavor
      ? [{ name: flavorAttr?.name || 'Sabor', option: selectedFlavor }]
      : undefined;

    addItem({
      productId: combo.id,
      name: combo.name,
      slug: combo.slug,
      price: parseFloat(combo.price),
      regularPrice: combo.regular_price ? parseFloat(combo.regular_price) : undefined,
      image: combo.images[0]?.src || '/placeholders/supplement.jpg',
      selectedAttributes: selectedAttrs,
      isCombo: true,
      comboItemsSummary: combo.comboItems,
      quantity: 1,
    });

    toast.success('¡Combo agregado con éxito!', {
      description: `${combo.name} añadido a tu carrito.`,
    });

    onClose();
  };

  const hasDiscount = combo.regular_price && parseFloat(combo.regular_price) > parseFloat(combo.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-brand-neon/40 bg-surface shadow-2xl">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-zinc-300 transition-colors hover:bg-black hover:text-white"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Imagen Cabecera con Overlay */}
        <div className="relative h-56 w-full bg-surface-elevated">
          <Image
            src={combo.images[0]?.src || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80'}
            alt={combo.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

          {/* Badge de Oferta */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-brand-neon px-3 py-1 text-xs font-black text-black uppercase shadow-neon-sm">
              <Flame className="h-4 w-4 fill-black" />
              OFERTA EXCLUSIVA INSTAGRAM
            </span>
          </div>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6">
          <h3 className="text-xl font-black italic tracking-tight text-white uppercase sm:text-2xl">
            {combo.name}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {combo.short_description || combo.description}
          </p>

          {/* Lo que incluye el Combo */}
          {combo.comboItems && combo.comboItems.length > 0 && (
            <div className="mt-4 rounded-2xl border border-surface-border bg-surface-elevated p-3.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-neon">
                📦 Este combo incluye:
              </span>
              <ul className="mt-2 space-y-1.5 text-xs text-zinc-200">
                {combo.comboItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 font-medium">
                    <Check className="h-4 w-4 shrink-0 text-brand-neon stroke-[3]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Selector de Sabor */}
          {flavorAttr && flavorAttr.options.length > 0 && (
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase text-zinc-300">
                Elegí el sabor ({flavorAttr.name}):
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {flavorAttr.options.map((flavor) => (
                  <button
                    key={flavor}
                    type="button"
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`rounded-xl border p-2.5 text-left text-xs font-bold transition-all ${
                      selectedFlavor === flavor
                        ? 'border-brand-neon bg-brand-neon/15 text-white shadow-neon-sm'
                        : 'border-surface-border bg-surface-elevated text-zinc-400 hover:text-white'
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Precios y Botón de Añadir */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-border pt-4">
            <div>
              <div className="text-2xl font-black text-white">
                {formatCurrency(combo.price)}
              </div>
              {hasDiscount && (
                <div className="text-xs font-semibold text-zinc-500 line-through">
                  Precio regular: {formatCurrency(combo.regular_price)}
                </div>
              )}
            </div>

            <button
              onClick={handleAddComboToCart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-brand-neon px-6 py-3.5 text-xs font-black tracking-wider text-black uppercase shadow-neon-glow transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>LLEVAR COMBO AHORA</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

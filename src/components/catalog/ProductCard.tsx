'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Zap, Flame, Check } from 'lucide-react';
import { WCProduct } from '@/types/woocommerce';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

interface ProductCardProps {
  product: WCProduct;
  onOpenComboModal?: (product: WCProduct) => void;
}

export default function ProductCard({ product, onOpenComboModal }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Atributos seleccionables (ej: Sabores)
  const flavorAttribute = product.attributes.find((a) =>
    a.name.toLowerCase().includes('sabor') || a.name.toLowerCase().includes('flavor')
  );

  const [selectedFlavor, setSelectedFlavor] = useState<string>(
    flavorAttribute && flavorAttribute.options.length > 0 ? flavorAttribute.options[0] : ''
  );

  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Si es un combo agrupado y se pasó callback modal, lo abrimos para personalizar
    if (product.isCombo && onOpenComboModal) {
      onOpenComboModal(product);
      return;
    }

    const selectedAttrs = selectedFlavor
      ? [{ name: flavorAttribute?.name || 'Sabor', option: selectedFlavor }]
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
      quantity: 1,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);

    toast.success('¡Agregado al carrito!', {
      description: `${product.name} ${selectedFlavor ? `(${selectedFlavor})` : ''}`,
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

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-surface-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-brand-neon/50 hover:shadow-neon-sm">
      {/* Contenedor Superior: Imagen y Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-elevated">
        <Link href={`/productos/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.images[0]?.src || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Badges Flotantes */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isCombo && (
            <span className="flex items-center gap-1 rounded-full bg-brand-neon px-2.5 py-1 text-[11px] font-black tracking-wider text-black uppercase shadow-sm">
              <Flame className="h-3 w-3 fill-black" />
              COMBO
            </span>
          )}
          {hasDiscount && discountPercent > 0 && (
            <span className="rounded-full bg-brand-red px-2.5 py-1 text-[11px] font-black tracking-wider text-white uppercase shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
          {product.featured && !product.isCombo && (
            <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-black text-black uppercase shadow-sm">
              <Zap className="h-3 w-3 fill-black" />
              DESTACADO
            </span>
          )}
        </div>
      </div>

      {/* Contenedor Inferior: Información y Acciones */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Categoría */}
        <span className="text-[11px] font-bold tracking-wider text-brand-neon uppercase">
          {product.categories[0]?.name || 'Suplementos'}
        </span>

        {/* Nombre de Producto */}
        <Link href={`/productos/${product.slug}`} className="mt-1 block">
          <h3 className="line-clamp-2 text-sm sm:text-base font-bold text-white transition-colors group-hover:text-brand-neon">
            {product.name}
          </h3>
        </Link>

        {/* Detalle breve de lo que incluye si es combo */}
        {product.comboItems && product.comboItems.length > 0 && (
          <div className="mt-2 space-y-1 rounded-lg bg-surface-elevated/80 p-2 text-[11px] text-zinc-300">
            {product.comboItems.slice(0, 2).map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <span className="text-brand-neon font-black">✓</span>
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Selector de Sabor Rápido (si aplica) */}
        {flavorAttribute && flavorAttribute.options.length > 0 && (
          <div className="mt-3">
            <span className="block text-[11px] font-semibold text-zinc-400">
              Sabor: <strong className="text-zinc-200">{selectedFlavor}</strong>
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {flavorAttribute.options.map((flavor) => (
                <button
                  key={flavor}
                  type="button"
                  onClick={() => setSelectedFlavor(flavor)}
                  className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all ${
                    selectedFlavor === flavor
                      ? 'bg-brand-neon text-black font-black'
                      : 'border border-surface-border bg-surface-elevated text-zinc-400 hover:text-white'
                  }`}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Precios y Botón de Añadir */}
        <div className="mt-4 pt-3 border-t border-surface-border/60 flex items-center justify-between gap-3">
          <div>
            <div className="text-lg sm:text-xl font-black tracking-tight text-white">
              {formatCurrency(product.price)}
            </div>
            {hasDiscount && (
              <div className="text-xs font-semibold text-zinc-500 line-through">
                {formatCurrency(product.regular_price)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-black tracking-wider uppercase transition-all duration-200 ${
              addedAnimation
                ? 'bg-emerald-500 text-white'
                : 'bg-brand-neon text-black hover:scale-105 active:scale-95 shadow-neon-sm'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="h-4 w-4 stroke-[3]" />
                <span>LISTO</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                <span>{product.isCombo ? 'ELEGIR' : 'AGREGAR'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

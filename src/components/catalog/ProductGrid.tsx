'use client';

import React, { useState, useMemo } from 'react';
import { Search, PackageX } from 'lucide-react';
import { WCProduct } from '@/types/woocommerce';
import ProductCard from './ProductCard';
import CategoryTabs from './CategoryTabs';
import ComboModal from '../combos/ComboModal';

interface ProductGridProps {
  initialProducts: WCProduct[];
  title?: string;
  subtitle?: string;
  initialCategory?: string;
}

export default function ProductGrid({
  initialProducts,
  title = '🔥 CATÁLOGO DE PRODUCTOS',
  subtitle = 'Seleccioná suplementos de alta pureza con entrega inmediata en todo el país.',
  initialCategory = 'todos',
}: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComboForModal, setSelectedComboForModal] = useState<WCProduct | null>(null);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Filtro por categoría
      const matchesCategory =
        activeCategory === 'todos' ||
        product.categories.some((c) => c.slug === activeCategory);

      // Filtro por búsqueda
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.categories.some((c) => c.name.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [initialProducts, activeCategory, searchTerm]);

  return (
    <section className="w-full">
      {/* Título de sección y Buscador */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-black italic tracking-tight text-white uppercase sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
          )}
        </div>

        {/* Buscador Rápido */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar proteína, creatina..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-surface pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-brand-neon focus:outline-none focus:ring-1 focus:ring-brand-neon"
          />
        </div>
      </div>

      {/* Tabs de Categorías */}
      <div className="mb-8">
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={(slug) => setActiveCategory(slug)}
        />
      </div>

      {/* Rejilla de Productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenComboModal={(combo) => setSelectedComboForModal(combo)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border bg-surface/50 p-12 text-center">
          <PackageX className="h-12 w-12 text-zinc-500 mb-3" />
          <h3 className="text-lg font-bold text-white">No encontramos productos</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Probá buscando con otro término o seleccionando otra categoría.
          </p>
          <button
            onClick={() => {
              setActiveCategory('todos');
              setSearchTerm('');
            }}
            className="mt-4 rounded-xl bg-brand-neon px-4 py-2 text-xs font-black text-black uppercase"
          >
            Ver todos los productos
          </button>
        </div>
      )}

      {/* Modal de Combo Dinámico */}
      {selectedComboForModal && (
        <ComboModal
          combo={selectedComboForModal}
          isOpen={Boolean(selectedComboForModal)}
          onClose={() => setSelectedComboForModal(null)}
        />
      )}
    </section>
  );
}

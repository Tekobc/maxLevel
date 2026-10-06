import React, { Suspense } from 'react';
import { getProducts } from '@/lib/woocommerce';
import ProductGrid from '@/components/catalog/ProductGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo de Suplementos — MAX LEVEL',
  description: 'Explorá todo nuestro stock de proteínas, creatinas, pre-entrenos y accesorios deportivos con envío a todo el país.',
};

export const revalidate = 3600;

export default async function ProductosPage() {
  const products = await getProducts({ perPage: 100 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <ProductGrid
        initialProducts={products}
        title="TODOS LOS SUPLEMENTOS"
        subtitle="Encontrá fórmulas avanzadas para potenciar tu rendimiento físico y tus ganancias musculares."
      />
    </div>
  );
}

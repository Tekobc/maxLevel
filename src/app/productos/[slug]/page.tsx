import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/woocommerce';
import ProductDetailClient from '@/components/catalog/ProductDetailClient';
import ProductCard from '@/components/catalog/ProductCard';
import { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Producto no encontrado — MAX LEVEL' };

  return {
    title: `${product.name} — MAX LEVEL Suplementos`,
    description: product.short_description || product.description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: product.images[0]?.src ? [product.images[0].src] : [],
    },
  };
}

export const revalidate = 3600;

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Productos relacionados
  const allProducts = await getProducts({ perPage: 8 });
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 space-y-16">
      {/* Componente Interactivo de Detalle */}
      <ProductDetailClient product={product} />

      {/* Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-surface-border pt-12">
          <h2 className="text-xl font-black italic tracking-tight text-white uppercase sm:text-2xl mb-6">
            TAMBIÉN TE PUEDE INTERESAR
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

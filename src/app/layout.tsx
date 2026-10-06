import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import FloatingCartButton from '@/components/common/FloatingCartButton';
import ClientProviders from '@/components/common/ClientProviders';

export const metadata: Metadata = {
  title: 'MAX LEVEL SUPLEMENTOS — Tienda Oficial & Combos Express',
  description: 'Suplementos deportivos de alto rendimiento: Proteínas Whey, Creatinas Creapure®, Pre-Entrenos y Combos Express con envíos a todo el país. Comprá sin registro.',
  keywords: ['suplementos deportivos', 'whey protein', 'creatina creapure', 'combos fitness', 'pre entreno', 'max level'],
  openGraph: {
    title: 'MAX LEVEL SUPLEMENTOS — Combos Express & Suplementación Deportiva',
    description: 'Combos de suplementación con descuento directo y envío express a todo el país.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-background text-zinc-100 antialiased selection:bg-brand-neon selection:text-black">
        <ClientProviders>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <FloatingCartButton />
        </ClientProviders>
      </body>
    </html>
  );
}

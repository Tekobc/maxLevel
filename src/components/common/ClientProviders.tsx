'use client';

import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useCartStore } from '@/store/useCartStore';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Rehidrata el estado de Zustand desde localStorage en el cliente
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <>
      {children}
      <Toaster
        theme="dark"
        position="bottom-left"
        toastOptions={{
          style: {
            background: '#121824',
            border: '1px solid #222F46',
            color: '#FFFFFF',
          },
        }}
      />
    </>
  );
}
